import React, { Component } from 'react';

// Core components, containing and rendering Groups
import BubbleMasonry from '../containers/bubble_masonry';
import ConceptDetails from '../containers/concept_details';

import FormEditGroup from '../containers/forms/form_group';
import FormEditConcept from '../containers/forms/form_concept';

// Import material-design toolbar
import { Button, Typography, Toolbar, AppBar } from '@material-ui/core';

// Navigation to different Router Links
import { Link } from 'react-router-dom';

export default class Bubble extends Component {
    constructor(props){
        super(props);

        this.handleLogin  = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        this.bubbleID = "blockchains"

        if (this.props.match.params)
            this.bubbleID = this.props.match.params['id'];
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

    renderAppBar(isAuthenticated){

        return (
            <AppBar className="menubar">
                    <Toolbar className="toolbar">

                        <Link to="/">
                            <Button type="button">
                                Home
                            </Button>
                        </Link>

                        <Typography variant="title" className="menubar-header">
                            /b/{this.bubbleID}
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

	render() {
        const { isAuthenticated } = this.props.auth; // function inside auth to check if logged in

		return (
            <div>
                {/* Toolbar */}
                {this.renderAppBar(isAuthenticated)}

                {/* Groups Overview */}
                <div className="groups-masonry">
                    <BubbleMasonry isAuthenticated={isAuthenticated()} bubbleID={this.bubbleID} />
                </div>

                {/* Holds concept details component */}
                <ConceptDetails 
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

            </div>
		);
	}
}