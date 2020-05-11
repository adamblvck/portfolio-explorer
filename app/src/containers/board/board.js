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


import Footer from '../../components/footer';
import FormNoteTaker from '../forms/forms_noteditor'
import MarkdownPopup from '../forms/form_markdown';

// Import material-design toolbar
import { Button, IconButton, Typography, Toolbar, AppBar, Avatar } from '@material-ui/core';
import { Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import MenuGroup from '../../components/menus/menu_groups';

// Navigation to different Router Links
import { Link } from 'react-router-dom';

import { NewNoteInNotetaker } from '../../actions/notetaker';

class Board extends Component {
    constructor(props){
        super(props);

        this.handleLogin  = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleNewNote = this.handleNewNote.bind(this);

        this.boardID = "blockchain"

        if (this.props.match.params && this.props.scope=="private"){  
            this.boardID = this.props.match.params['url_name'];
            this._boardId = this.props.match.params['id'];    
                
        } else if (this.props.match.params && this.props.scope=="public") {
            this.boardID = this.props.match.params['url_name'];
        }

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
                                    handler: this.handleEditLayout
                                },
                                {
                                    label: "Edit Layout",
                                    needAuth: true,
                                    render: this.renderMenuItem,
                                    handler: this.handleEditLayout
                                },
                                {
                                    label: "Open Board Settings",
                                    needAuth: false,
                                    render: this.renderMenuItem,
                                    handler: this.handleEditLayout
                                },
                                {
                                    label: "Publish Board",
                                    needAuth: true,
                                    render: this.renderMenuItem,
                                    handler: this.handleEditLayout
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
                            scope={this.props.scope}
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

                <FormNoteTaker
                    open={false}
                />

            </div>
		);
	}
}

export default connect(null, { NewNoteInNotetaker })(Board);