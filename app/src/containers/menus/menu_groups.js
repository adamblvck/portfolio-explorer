import React, { Component } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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
                {/* <MenuItem onClick={this.handleClose}>
                    Add group
                </MenuItem>             */}


                {this.props.menuItems.map(item => (
                  <MenuItem key={item.label} onClick={}>
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </div>
        );

    }
}