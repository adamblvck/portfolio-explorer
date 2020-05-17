import React, { Component } from 'react';
import { connect } from 'react-redux';

// Core components, containing and rendering Groups
import BoardMasonry from './board_masonry';

// Modal to display concept details
import ConceptModalFixed from '../concept/concept_modal_fixed';
import ConceptModalMarkdown from '../concept/concept_modal_markdown';

// Forms
import FormEditGroup from '../forms/form_group';
import FormEditConcept from '../forms/form_concept';
import FormBoard from '../forms/form_board';
import FormPublish from '../forms/form_publish';

import Footer from '../../components/footer';
import FormNoteTaker from '../forms/forms_noteditor'
import MarkdownPopup from '../forms/form_markdown';

// Import material-design toolbar
import { Button, IconButton, Typography, Toolbar, AppBar, Avatar, Chip} from '@material-ui/core';

import { Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import MenuGroup from '../../components/menus/menu_groups';

// Navigation to different Router Links
import { Link } from 'react-router-dom';

// import actions
import { NewNoteInNotetaker } from '../../actions/notetaker';
import { openGroupForm, openBoardForm, openPublishForm } from '../../actions/form';


class Board extends Component {
    constructor(props){
        super(props);

        this.handleLogin  = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleNewNote = this.handleNewNote.bind(this);

        this.boardID = "blockchain"

        if (this.props.match.params ){  
            console.log("props.match", this.props.match);
            this.boardID = this.props.match.params['url_name'];
            this._boardId = this.props.match.params['id'];    
            this.scope = this.props.match.params['scope'];
        }
                
        // } else if (this.props.match.params && this.props.scope=="public") {
        //     this.boardID = this.props.match.params['url_name'];
        // }

        this.state = {
            dnd_enabled: false
        }
    }

    componentDidMount(){

    }

    handleLogin() {
        this.props.auth.login();
    }

    handleLogout() {
        this.props.auth.logout();
        this.forceUpdate();
    }

    handleNewNote () {
        this.props.NewNoteInNotetaker({});
    }

    handleEditLayout = () => {
        this.setState({dnd_enabled: !this.state.dnd_enabled});
    }

    renderMenuItem(component) {
        const { label, handler } = component;

        return (
            <MenuItem
                color="secondary" key={`menu-${label.toLowerCase().split(' ').join('-')}`}
                onClick={() => (handler())}
            >
                {label}
            </MenuItem>
        );
    }

    renderAppBar(isAuthenticated){

        console.log(this.props.board);

        return (
            <AppBar className="menubar">
                <Toolbar className="toolbar">
                    <Link to="/">
                        <Button type="button">
                            Home
                        </Button>
                    </Link>

                    {/* <div className="board-name-container"> */}
                        <Typography variant="h1" className="menubar-header">
                            {this.boardID}
                        </Typography>

                        <MenuGroup 
                            className="groupmenu-btn"
                            isAuthenticated={isAuthenticated}
                            components={ [
                                {
                                    label: "Add Group",
                                    needAuth: true,
                                    render: this.renderMenuItem,
                                    handler: () => {
                                        const params = {
                                            mode: "new",
                                            initialValues: {
                                                board_id: this.boardID,
                                                _boardId: this._boardId,
                                                background:"linear-gradient(45deg, #4532E6, #1cb5e0)",
                                                n_depth:0,
                                                parent_groupId:null
                                            }
                                        };
            
                                        this.props.openGroupForm(params)
                                    }
                                },
                                {
                                    label: "Edit Layout",
                                    needAuth: true,
                                    render: this.renderMenuItem,
                                    handler: this.handleEditLayout
                                },
                                {
                                    label: "Open Board Settings",
                                    needAuth: true,
                                    render: this.renderMenuItem,
                                    handler: () => {
                                        const params = {
                                            mode: "update",
                                            initialValues: this.props.board
                                        };

                                        this.props.openBoardForm(params);
                                    }
                                },
                                {
                                    label: "Publish Board",
                                    needAuth: true,
                                    render: this.renderMenuItem,
                                    handler: () => {
                                        const params = {
                                            initialValues: this.props.board
                                        };

                                        this.props.openPublishForm(params);
                                    }
                                }
                            ]}
                        />
                    {/* </div> */}

                    {/* <Button onClick={this.handleNewNote}> New Note </Button> */}

                    {
                        isAuthenticated() && (
                            <Button onClick={this.handleLogout} > Logout <Avatar alt="avatar" src={this.props.auth.getPicture()} style={{marginLeft:'7px'}} /> </Button>
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

	render() {
        const { isAuthenticated } = this.props.auth; // function inside auth to check if logged in

        console.log(this._boardId, this.boardID.toLowerCase());

		return (
            <div>
            {/* <div style={{'position': 'relative', 'min-height': '100vh'}}> */}
                {/* Toolbar */}
                {this.renderAppBar(isAuthenticated)}

                <div style={{'position':'relative'}}>

                    {/* Groups Overview */}
                    <div className="groups-masonry">
                        <BoardMasonry
                            isAuthenticated={isAuthenticated()}
                            scope={this.scope}
                            _boardId={this._boardId}
                            boardID={this.boardID.toLowerCase()}
                            dnd_enabled={this.state.dnd_enabled}
                         />
                    </div>
                </div>

                {/* Holds concept details component */}
                <ConceptModalMarkdown 
                    id="concept-detail-popper"
                    isAuthenticated={isAuthenticated()}
                />

                {/* Holds form for creating/editing groups */}
                <FormEditGroup
                    label="default"
                    mode="new"
                    open={false}
                />

                {/* Holds form for creating/editing concepts */}
                <FormEditConcept
                    label="default"
                    mode="new"
                    open={false}
                />

                {/* <FormNoteTaker
                    open={false}
                /> */}

                <FormBoard
                    label="default"
                    mode="new"
                    open={false}
                />

                <FormPublish
                    label="default"
                    open={false}
                />

            </div>
		);
	}
}

function mapStateToProps (state) {

    if (state.boards !== null && !_.isEmpty(state.boards) ){ // only if groups exist, and result is NOT EMPTY

        console.log("state.boards", state.boards);

        return {
            board: state.boards // WHY THE FUCK DOES THIS IS CALLED BOARDS IF ITS ONLY ONE BOARD?!
            // board_id: state.boards.id,
            // board_scope: state.boards.scope,
            // board_name: state.boards.board_id,
            // board_background: state.boards.background,
            // group_layouts: state.boards.group_layouts,
            // groups: state.boards.groups.groups,
            // concepts: state.boards.groups.concepts,
            // modified: state.boards.groups.modified // increases with 1 if groups/concepts are modified
        };
    }

    return {};
}

export default connect(mapStateToProps, { NewNoteInNotetaker, openGroupForm, openBoardForm, openPublishForm})(Board);