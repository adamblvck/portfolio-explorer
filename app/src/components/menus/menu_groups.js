import React, { Component } from 'react';

import { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export default class MenuGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
        }

    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render(){
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div>
                <IconButton
                    aria-label="More"
                    aria-owns={open ? 'long-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    disableAutoFocusItem={false}
                    id="long-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={this.handleClose}
                    PaperProps={{
                        style: {
                        maxHeight: 48 * 4.5,
                        width: 200,
                        },
                    }}
                >
                {this.props.components.map(component => (
                    // if this menu item needs authentication, but the user isn't authenticated, dont render
                    ((component.needAuth && this.props.isAuthenticated) || (!component.needAuth)) && (component.render(component))
                ))}
                </Menu>
            </div>
        );

    }
}