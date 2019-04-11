import React, { Component } from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';

// Actions performed in Bubble Masonry
import { fetchBubbles } from '../actions';

// Navigation to different Router Links
import { Link } from 'react-router-dom';

// Import material-design toolbar
import PropTypes from 'prop-types';
import { Button, Typography, Toolbar, AppBar, Card, CardHeader, CardContent, withStyles} from '@material-ui/core';

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

    renderCard(bubble){
        const { classes } = this.props;

        const default_background = "linear-gradient(45deg, rgb(40, 48, 72), rgb(133, 147, 152))"
        const background_color =  default_background; //bubble.color ? bubble.background : default_background;

        const link_to_bubble = `/b/${bubble.name}`;

        return (
            <Card className={classes.card} elevation={3}>
                <CardHeader
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

    renderMasonry() {
        return (
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry gutter="0 auto 0 auto">
                    {this.renderBubbles()}
                    {/* <FormAddGroup 
                        n_depth={0}
                        parent_groupId={null}
                        addButtonText="Add Group"
                    /> */}
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
                { this.renderMasonry() }
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
    connect(mapStateToProps, { fetchBubbles})(BubblesOverview)
);