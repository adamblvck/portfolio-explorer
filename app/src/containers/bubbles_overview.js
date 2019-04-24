import React, { Component } from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';

// Actions performed in Bubble Masonry
import { fetchBubbles } from '../actions/fetching_public';
import { openBubbleForm } from '../actions/form';
import { deleteBubble } from '../actions/bubble';

// Navigation to different Router Links
import { Link } from 'react-router-dom';

// Import material-design toolbar
import PropTypes from 'prop-types';
import { Button, Typography, Toolbar, AppBar, Card, CardHeader, CardContent, withStyles, MenuItem } from '@material-ui/core';

import MenuGroup from './menus/menu_groups';

import FormBubble from './forms/form_bubble';

// Masonry
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"


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

class BubblesOverview extends Component {
    constructor(props){
        super(props);

        this.handleLogin  = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleDeleteBubble = this.handleDeleteBubble.bind(this);

        this.renderFormEditBubble = this.renderFormEditBubble.bind(this);
        this.renderDeleteBubble = this.renderDeleteBubble.bind(this);
    }

    componentDidMount(){
        this.props.fetchBubbles();
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

                    <Typography variant="title" className="menubar-header">
                        Bubbles
                    </Typography>

                    {
                        isAuthenticated() && (
                            <Button onClick={this.handleLogout} > Logout </Button>
                        )
                    }

                    {
                        !isAuthenticated() && (
                            <Button onClick={this.handleLogin} > Login </Button>
                        )
                    }
                </Toolbar>
            </AppBar>
        );
    }

    handleDeleteBubble(bubble){
        if( confirm('Sure want to delete?')) {
            this.props.deleteBubble(bubble);
        }
    }

    renderFormEditBubble(component) {
        const { label, bubble } = component;

        const params = {
            mode: "update",
            initialValues: bubble
        };

        return (
            <MenuItem
                color="secondary" 
                key={`editBubble-${bubble.id}`}
                onClick={() => this.props.openBubbleForm(params)}
            >
                {label}
            </MenuItem>
        );
    }

    renderDeleteBubble(component) {
        const { label, bubble } = component;

        return (
            <MenuItem
                color="secondary" 
                key={`deleteBubble-${bubble.id}`}
                onClick={() => this.handleDeleteBubble(bubble)}
            >
                {label}
            </MenuItem>
        );
    }

    renderCard(bubble){
        const { classes } = this.props;

        const default_background = "linear-gradient(45deg, rgb(40, 48, 72), rgb(133, 147, 152))"
        const background_color = bubble.background ? bubble.background : default_background;

        const link_to_bubble = `/b/${bubble.bubble_id}`;

        return (
            <Card className={`${classes.card} bubble_overview_bubble`} elevation={3}>
                <CardHeader
                    action={
                        this.props.auth.isAuthenticated() && // if authenticated
                        <MenuGroup 
                            className="groupmenu-btn"
                            isAuthenticated={this.props.auth}
                            components={ [
                                {
                                    label: "Edit Bubble",
                                    needAuth: true,
                                    bubble: bubble,
                                    render: this.renderFormEditBubble
                                },
                                {
                                    label: "Delete Bubble",
                                    needAuth: true,
                                    bubble: bubble,
                                    render: this.renderDeleteBubble
                                }
                            ]}
                        />
                    }
                    title={bubble.name}
                    subheader={bubble.description}
                    style={{backgroundColor: background_color, background: background_color}}
                    className='RootGroupHeader'
                />
                <CardContent className={classes.content}>
                    <Link to={link_to_bubble}>
                        <Button type="button">
                            {bubble.name}
                        </Button>
                    </Link>

                </CardContent>
            </Card>
        );
    }

    renderBubbles(){
        return _.map(this.props.bubbles, bubble => {
            return (
                <div key={bubble.id}>
                    {this.renderCard(bubble)}
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
                    {this.renderBubbles()}
                    
                    {/* TODO: Refactor below item into a function */}
                    { isAuthenticated() && 
                        <MenuItem
                            onClick={() => {
                                const params = {
                                    mode: "new",
                                    initialValues: {
                                        name: "New Bubble",
                                        bubble_id: "unique bubble identifier",
                                        description: "Write description of your bubble here",
                                        background: "linear-gradient(45deg, #4532E6, #1cb5e0)"}
                                };

                                this.props.openBubbleForm(params);
                            }}
                        >
                            Add Group
                        </MenuItem>
                    }

                </Masonry>
            </ResponsiveMasonry>
        );
    }

    render(){
        const { isAuthenticated } = this.props.auth; // function inside auth to check if logged in

        return (
            <div className="groups-masonry">
                {/* Toolbar */}
                {this.renderAppBar(isAuthenticated)}

                {/* Holds the overview of all bubbles*/}
                { this.renderMasonry(isAuthenticated) }

                {/* Holds form for creating/editing concepts */}
                <FormBubble
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
        bubbles: state.bubbles
    };
}

BubblesOverview.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(
    connect(mapStateToProps, { fetchBubbles, openBubbleForm, deleteBubble })(BubblesOverview)
);