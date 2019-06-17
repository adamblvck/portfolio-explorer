import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import markdown from "marked";

// material design imports
import { Card, CardHeader, CardContent, CardActions, IconButton } from '@material-ui/core';
import { Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { hideFullscreenMarkdown } from '../../actions/markdown';

class MarkdownPopup extends Component {
    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.props.hideFullscreenMarkdown();
    }

    render() {
        console.log(this.props);

        if (this.props.markdown === null)
            return(<div></div>);

        const title = "testtest";
        const headerBackground = 'black';

        const {md_html, open} = this.props.markdown;

        return(
            open && <Card className="fullscreen-read-card">
                <CardHeader
                    className="fullscreen-read-card-header"
                    title={title}
                    style={{
                        // position: 'absolute',
                        // left: 0,
                        // right:0,
                        // height:'40px',
                        background:headerBackground
                    }}
                    action={
                        <IconButton onClick={() => this.handleClose()} >
                            <CloseIcon/>
                        </IconButton>
                    }
                />
                <CardContent className="fullscreen-read-card-content">
                    <div 
                        dangerouslySetInnerHTML={{__html:md_html}}
                    ></div>
                </CardContent>
                <CardActions>
                    <Button 
                        onClick={() => this.handleClose()}
                        variant="outlined"
                    >
                        Close
                    </Button>
                </CardActions>
            </Card>
        );
    }
};

function mapStateToProps(state) {
    return {
        markdown: state.markdown
    };
};

export default connect( mapStateToProps, {hideFullscreenMarkdown})(MarkdownPopup);