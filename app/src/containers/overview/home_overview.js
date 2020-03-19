import React, { Component } from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';

// Actions performed in Board Masonry
import { fetchBoards } from '../../actions/fetching_public';
import { openBoardForm } from '../../actions/form';
import { deleteBoard } from '../../actions/board';

// Navigation to different Router Links
import { Link } from 'react-router-dom';

// Import material-design toolbar
import PropTypes from 'prop-types';
import { Button, Typography, Toolbar, AppBar, Paper, Card, CardHeader, CardContent, withStyles, MenuItem, Avatar } from '@material-ui/core';

import MenuGroup from '../../components/menus/menu_groups';
import FormBoard from '../forms/form_board';

// Masonry
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

import { gradients, getTextColor } from '../forms/gradient_helper.js';

const styles = {
    card: {
        maxWidth: 450,
        margin: 7.5
    },
    media: {
      height: 100,
    },
    content: {
        height: "auto",
        width: "auto"
    }
};

class HomeOverview extends Component {
    constructor(props){
        super(props);

        this.handleLogin  = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleDeleteBoard = this.handleDeleteBoard.bind(this);

        this.renderFormEditBoard = this.renderFormEditBoard.bind(this);
        this.renderDeleteBoard = this.renderDeleteBoard.bind(this);
    }

    componentDidMount(){
        this.props.fetchBoards();
    }

    handleLogin() {
        this.props.auth.login();
    }

    handleLogout() {
        this.props.auth.logout();
        this.forceUpdate();
    }

    renderAppBar(isAuthenticated){        
        return (
            <AppBar className="menubar">
                <Toolbar className="toolbar">
                    <Link to="/">
                        <Button type="button">
                            About
                        </Button>
                    </Link>

                    <Typography variant="h1" className="menubar-header">
                        Boards
                    </Typography>

                    {/* <Button> New Note </Button> */}

                    {
                        isAuthenticated && (
                            <Button onClick={this.handleLogout} > Logout <Avatar alt="avatar" src={this.props.auth.getPicture()} style={{marginLeft:'7px'}} /> </Button>
                        )
                    }

                    {
                        !isAuthenticated && (
                            <Button onClick={this.handleLogin} > Login </Button>
                        )
                    }
                </Toolbar>
            </AppBar>
        );
    }

    handleDeleteBoard(board){
        if( confirm('Sure want to delete?')) {
            this.props.deleteBoard(board);
        }
    }

    renderFormEditBoard(component) {
        const { label, board } = component;

        console.log(board);

        const params = {
            mode: "update",
            initialValues: board
        };

        return (
            <MenuItem
                color="secondary" 
                key={`editBoard-${board.id}`}
                onClick={() => this.props.openBoardForm(params)}
            >
                {label}
            </MenuItem>
        );
    }

    renderDeleteBoard(component) {
        const { label, board } = component;

        return (
            <MenuItem
                color="secondary" 
                key={`deleteBoard-${board.id}`}
                onClick={() => this.handleDeleteBoard(board)}
            >
                {label}
            </MenuItem>
        );
    }

    renderCard(board){
        const { classes } = this.props;

        const default_background = gradients[0].value;
        const background_color = board.background ? board.background : default_background;
        const text_header_color = getTextColor(background_color);

        const link_to_board = `/b/${board.board_id}`;

        const isAuthenticated = this.props.auth.isAuthenticated();
        console.log("isAuthenticated", isAuthenticated);

        return (
            <Card className={`${classes.card} board_overview_board`} elevation={3}>
                <CardHeader
                    action={
                        // isAuthenticated && // if authenticated
                        <MenuGroup 
                            className="groupmenu-btn"
                            isAuthenticated={this.props.auth}
                            components={ [
                                {
                                    label: "Edit Board",
                                    needAuth: true,
                                    board: board,
                                    render: this.renderFormEditBoard
                                },
                                {
                                    label: "Delete Board",
                                    needAuth: true,
                                    board: board,
                                    render: this.renderDeleteBoard
                                }
                            ]}
                        />
                    }
                    title={board.name}
                    subheader={board.description}
                    style={{backgroundColor: background_color, background: background_color, color: text_header_color}}
                    className='RootGroupHeaderHome'
                />
                <CardContent className={classes.content}>
                    <Link to={link_to_board}>
                        <Button type="button">
                            {board.name}
                        </Button>
                    </Link>

                </CardContent>
            </Card>
        );
    }

    renderBoards(){
        return _.map(this.props.boards, board => {
            return (
                <div key={board.id}>
                    {this.renderCard(board)}
                </div>
            );
        });
    }

    renderMasonry(isAuthenticated) {
        return (
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry gutter="0 auto 0 auto">
                    {this.renderBoards()}

                    {/* TODO: Refactor below item into a function */}
                    { isAuthenticated && 
                        <Button
                            elevation={1}
                            variant="outlined"
                            className="add-button-in-col"
                            onClick={() => {
                                const params = {
                                    mode: "new",
                                    initialValues: {
                                        name: "New Board",
                                        id: "Will be generated by server",
                                        description: "Write description of your board here",
                                        background: gradients[0].value}
                                };

                                this.props.openBoardForm(params);
                            }}
                        >
                                Add Group
                        </Button>
                    }

                </Masonry>
            </ResponsiveMasonry>
        );
    }

    render(){
        const isAuthenticated = this.props.auth.isAuthenticated(); // function inside auth to check if logged in

        return (
            <div className="groups-masonry">
                {/* Toolbar */}
                {this.renderAppBar(isAuthenticated)}

                {/* Holds the overview of all boards*/}
                <Typography variant="h4" className="home-overview-header">Editorial</Typography>
                { this.renderMasonry(isAuthenticated) }
        
                {/* Holds the overview of all boards*/}
                { isAuthenticated && <Typography variant="h4" className="home-overview-header">Private Boards</Typography> }
                { isAuthenticated && this.renderMasonry(isAuthenticated) }

                {/* Holds form for creating/editing concepts */}
                <FormBoard
                    label="default"
                    mode="new"
                    open={false}
                />

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        boards: state.boards
    };
}

HomeOverview.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(
    connect(mapStateToProps, { fetchBoards, openBoardForm, deleteBoard })(HomeOverview)
);