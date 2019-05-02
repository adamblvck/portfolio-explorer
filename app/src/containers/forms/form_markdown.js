import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import markdown from "marked";

// material design imports
import { Card, CardHeader, CardContent, CardActions, Modal, MenuItem } from '@material-ui/core';
import { Button, Paper } from '@material-ui/core';

class MarkdownPopup extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div></div>
        );
    }
};

export default connect( null, null)(MarkdownPopup);