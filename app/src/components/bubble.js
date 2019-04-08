import React, { Component } from 'react';

// Core components, containing and rendering Groups
import GroupsMasonry from '../containers/groups_masonry';

// Stylish background 
import Particles from 'react-particles-js';
import particlesConfig from '../../configs/particlesjs-config';

// Import material-design toolbar
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';

import Auth from '../auth/auth';

export default class Bubble extends Component {
    constructor(props){
        super(props);

        this.handleLogin  = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount(){
        console.log(this.props);
    }

    handleLogin() {
        this.props.auth.login();
    }

    handleLogout() {
        this.props.auth.logout();
        this.forceUpdate();
    }

	render() {
        const { isAuthenticated } = this.props.auth; // function inside auth to check if logged in

		return (
            <div>
                <AppBar className="menubar">
                    <Toolbar>
                        <Typography variant="title" className="menubar-header">
                            Blockchain Ecosystem
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

                <div className="groups-masonry">
                    <GroupsMasonry isAuthenticated={isAuthenticated()}/>
                </div>

                {/* TODO: Optimize further after done programming */}
                <Particles
                    className="particle-background"
                    params={particlesConfig}
                    style={{
                        width: '100%'
                    }}
                />

            </div>
		);
	}
}