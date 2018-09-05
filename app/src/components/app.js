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

export default class App extends Component {
	render() {
		return (
            <div>
                <AppBar className="menubar">
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                            Blockchain Ecosystem Explorer
                        </Typography>
                    </Toolbar>
                </AppBar>

                <div className="groups-masonry"><GroupsMasonry/></div>

                {/* TODO: Optimize further after done programming
                <Particles
                    className="particle-background"
                    params={particlesConfig}
                    style={{
                        width: '100%'
                    }}
                >

                </Particles> */}
            </div>
		);
	}
}

