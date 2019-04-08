import React, { Component } from 'react';

// Navigation to different Router Links
import { Link } from 'react-router-dom';

// Import material-design toolbar
import { Button, Typography, Toolbar, AppBar } from '@material-ui/core';

export default class BubblesOverview extends Component {
    constructor(props){
        super(props);
    }

    handleBlockchainClick(){
        
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

    render(){
        const { isAuthenticated } = this.props.auth; // function inside auth to check if logged in

        return (
            <div>
                {/* Toolbar */}
                {this.renderAppBar(isAuthenticated)}

                <div className="groups-masonry">
                    <Link to="/b/blockchain">
                        <Button type="button">
                            Blockchain
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }
}