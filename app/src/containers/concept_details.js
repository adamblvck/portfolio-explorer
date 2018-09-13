import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// material design imports
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';

import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';

// markdown react-component rendering
import ReactDOM from "react-dom";
import markdown from "marked";

// import update form
import FormEditConcept from './forms/form_editconcept';
import { Button, CardHeader } from '@material-ui/core';

// import actions
import { deleteConcept } from '../actions';

// to make multi-column layouts
import { Grid, Row, Col } from 'react-bootstrap';

class ConceptDetails extends Component {
    constructor(props) {
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
    };

    handleDelete(){
        if( confirm('Sure want to delete?')) {
            this.props.deleteConcept(this.props.concept);
        }
    }

    renderReferenceLinks(details){
        if (!details.reference_links)
            return (<div></div>);
        
        const {reference_links} = details;

        console.log(reference_links);

        return _.map(reference_links, ref_link => {
            return (
                <li className="list-unstyled"><a href={ref_link.url} target="_blank">{ref_link.name}</a></li>
            )
        });

    }

    renderContent(){
        let md_summary = `<div></div>`;
        if (this.props.concept.details.summary)
            md_summary = markdown.parse(this.props.concept.details.summary);

        return (
            <Card className="concept-detail-card">
                {/* <CardMedia
                    className="concept-detail-media"
                    image={this.props.concept.logo_url}
                /> */}
                <CardHeader
                    className="concept-detail-card-header"
                    title={this.props.concept.details.title}
                >
                    <div>{this.renderReferenceLinks(this.props.concept.details)}</div>
                </CardHeader>
                <CardContent
                    className="concept-detail-content"
                >
                    <Grid>
                        <Row>
                            <Col xs={12} md={8}>
                                {/* render summary */}
                                <div dangerouslySetInnerHTML={{__html:md_summary}} />
                            </Col>
                            <Col xs={6} md={4}>
                                {/* Reference links */}
                                <Row>
                                    {this.renderReferenceLinks(this.props.concept.details)}
                                </Row>
                                {/* Pro's & Cons */}
                                <Row>
                                    Pro's and con's
                                </Row>                              

                            </Col>
                        </Row>
                    </Grid>

                    
                </CardContent>
                <CardActions>
                    <FormEditConcept
                        groupId={this.props.concept.group.id}
                        groupName={this.props.concept.group.name}
                        initialValues={{...this.props.concept, groupId: this.props.concept.group.id}}
                    />
                    <Button
                        type="cancel" 
                        color="secondary" 
                        onClick={this.handleDelete}>
                        Delete
                    </Button>
                </CardActions>
            </Card>
        );
    }

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
                        {this.renderContent()}
                    </Fade>
                )}
            </Popper>      
        );
    }
}

export default connect( null, {deleteConcept})(ConceptDetails);



