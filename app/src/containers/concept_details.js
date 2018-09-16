import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// material design imports
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Modal from '@material-ui/core/Modal';


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

        this.state = { 
            open: false
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        // this.renderContent = this.renderContent.bind(this);
    };

    componentWillReceiveProps(nextProps) {

        console.log('nextProps',nextProps);

        if (nextProps.activeConcept) {
          this.setState({
            open: nextProps.activeConcept.open
          })
        }
    }

    handleDelete(){
        if( confirm('Sure want to delete?')) {
            this.props.deleteConcept(this.props.concept);
        }
    }

    handleClose = () => {
        console.log("handling close");
        this.setState({ open: false });
    };

    renderReferenceLinks(details){
        if (!details.reference_links)
            return (<div></div>);
        
        const {reference_links} = details;

        console.log(reference_links);

        return _.map(reference_links, ref_link => {
            return (
                <li // list item
                    key={ref_link.url} 
                    className="list-unstyled">
                    <a // anchor
                        href={ref_link.url} 
                        target="_blank"
                    >
                        {ref_link.name}
                    </a>
                </li>
            )
        });

    }

    renderContent(concept){
        let md_summary = `<div></div>`;
        if (concept.details.summary)
            md_summary = markdown.parse(concept.details.summary);

        return (
            <Card className="concept-detail-card">
                {/* <CardMedia
                    className="concept-detail-media"
                    image={this.props.concept.logo_url}
                /> */}
                <CardHeader
                    className="concept-detail-card-header"
                    title={concept.details.title}
                >
                    <div>{this.renderReferenceLinks(concept.details)}</div>
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
                                    {this.renderReferenceLinks(concept.details)}
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
                        groupId={concept.group.id}
                        groupName={concept.group.name}
                        initialValues={{...concept, groupId: concept.group.id}}
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
        // check if activeConcepts are ready to be viewed
        const { activeConcept } = this.props;
        const show_details = !this.props.activeConcept ? false : true;

        // assign open/ anchorEl/concept if activeConcept exists.. otherwise apply default values
        const open = show_details ? activeConcept.open : false;
        const anchorEl = show_details ? activeConcept.anchorEl : null;
        const concept = show_details ? activeConcept.concept : null;

        if ((!show_details) && (!open)){
            return (
                <div></div>
            );
        }

        return (
            <Modal
                aria-labelledby="concept-detail"
                aria-describedby="concept-detail-description"

                open={this.state.open}
                onClose={this.handleClose}
            >
                {this.renderContent(concept)}
            </Modal>      
        );
    }
}

function mapStateToProps (state) {
    return {
        activeConcept: state.activeConcept
    };
}

export default connect( mapStateToProps, {deleteConcept})(ConceptDetails);



