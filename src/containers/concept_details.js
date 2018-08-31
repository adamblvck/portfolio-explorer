import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// material design imports
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';

class ConceptDetails extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <Popper 
                id="concept-detail-popper" 
                open={this.props.open} 
                anchorEl={this.props.anchorEl} 
                transition
                placement="bottom-start"
                disablePortal={true}
                modifiers={{
                    flip: {
                    enabled: true,
                    },
                    preventOverflow: {
                    enabled: true,
                    boundariesElement: 'scrollParent',
                    },
                    // arrow: {
                    // enabled: false,
                    // element: arrowRef,
                    // },
                }}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                    <Paper className="concept-detail-paper">
                        <Typography>{this.props.concept.details.title}</Typography>
                        <Typography>{this.props.concept.details.summary}</Typography>
                    </Paper>
                    </Fade>
                )}
            </Popper>      
        );
    }
}

export default ConceptDetails;

