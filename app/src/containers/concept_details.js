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
import MenuItem from '@material-ui/core/MenuItem';

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

// import icons
import PlusIcon from '@material-ui/icons/AddCircleRounded';
import MinusIcon from '@material-ui/icons/RemoveCircleRounded';
import LinkIcon from '@material-ui/icons/LinkRounded';

import MenuGroup from './menus/menu_groups';

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
        this.renderFormDeleteConcept = this.renderFormDeleteConcept.bind(this);
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

    handleDelete(concept){
        if( confirm('Sure want to delete?')) {
            this.props.deleteConcept(concept);
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

        return _.map(reference_links, ref_link => {
            return (
                <li // list item
                    key={ref_link.url} 
                    className="list-unstyled">
                    <a // anchor
                        href={ref_link.url} 
                        target="_blank"
                    >
                        <LinkIcon style={{verticalAlign: 'middle'}}/>{ref_link.name}
                    </a>
                </li>
            )
        });

    }

    renderList(items, component){
        return _.map(items, item => {
            return (
                <li
                    key={item}
                    className="list-unstyled"
                >   
                    {component}
                    {item}
                </li>
            )
        });
    }

    renderProsAndCons(details){
        if (!details.trade_off)
            return (<div></div>);

        const {pros} = details.trade_off;
        const {cons} = details.trade_off;

        return(
            <div>
                <h2>Pro's</h2>
                {this.renderList(pros, <PlusIcon color="primary" className="trade-off-icon"/>)}
                <h2>Con's</h2>
                {this.renderList(cons, <MinusIcon color="secondary" className="trade-off-icon"/>)}
            </div>
        )
    }

    renderFormEditConcept(component) {
        const { concept } = component;

        return (
            <FormEditConcept
                groupId={concept.group.id}
                groupName={concept.group.name}
                initialValues={{...concept, groupId: concept.group.id}}
            />
        );
    }

    renderFormDeleteConcept(component) {
        const { concept } = component;

        return (
            <MenuItem
                color="secondary" 
                onClick={() => this.handleDelete(concept)}>
                Delete concept
            </MenuItem>
        );
    }

    renderContent(concept){
        let md_summary = `<div></div>`;
        if (concept.details.summary)
            md_summary = markdown.parse(concept.details.summary);

        return (
            <Card className="concept-detail-card">
                {/* contains the concept logo / image / picture */}
                <Paper
                    elevation={3}
                    className="concept-detail-logo"
                >
                    <img src={concept.logo_url} />
                </Paper>

                <CardHeader
                    className="concept-detail-card-header"
                    title={concept.details.title}
                    style={{backgroundColor: concept.meta.color, background: concept.meta.color}}
                    action={
                            <MenuGroup 
                                className="groupmenu-btn" 
                                components={ [
                                    {
                                        label:"Edit Concept",
                                        concept: concept,
                                        render:this.renderFormEditConcept
                                    },
                                    {
                                        label:"Delete Concept",
                                        concept: concept,
                                        render:this.renderFormDeleteConcept
                                    }
                                ]}
                            />
                        }
                />         

                <CardContent
                    className="concept-detail-content"
                >
                    <Grid>
                        <Row>
                            <Col xs={12} md={8}>
                                {/* render summary */}
                                <div dangerouslySetInnerHTML={{__html:md_summary}} />
                            </Col>
                            <Col xs={12} md={4}>
                                {/* Reference links */}
                                <Row>
                                    {this.renderReferenceLinks(concept.details)}
                                </Row>
                                {/* Pro's & Cons */}
                                <Row>
                                    {this.renderProsAndCons(concept.details)}
                                </Row>                              

                            </Col>
                        </Row>
                    </Grid>
                </CardContent>
                <CardActions
                    style={{float:'right'}}
                >
                    {/* <FormEditConcept
                        groupId={concept.group.id}
                        groupName={concept.group.name}
                        initialValues={{...concept, groupId: concept.group.id}}
                    />
                    <Button
                        type="cancel" 
                        color="secondary" 
                        onClick={this.handleDelete}>
                        Delete
                    </Button> */}
                    <Button
                        type="Back" 
                        onClick={this.handleClose}>
                        Back
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



