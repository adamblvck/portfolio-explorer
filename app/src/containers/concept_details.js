import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import posed from 'react-pose';
import ReactDOM from "react-dom";
import markdown from "marked";

// material design imports
import { Card, CardHeader, CardContent, CardMedia, CardActionArea, CardActions, Modal, MenuItem } from '@material-ui/core';
import { Button, Popper, Paper, Fade, Typography } from '@material-ui/core';

// import icons
import PlusIcon from '@material-ui/icons/AddCircleRounded';
import MinusIcon from '@material-ui/icons/RemoveCircleRounded';
import LinkIcon from '@material-ui/icons/LinkRounded';

// own components
import FormEditConcept from './forms/form_editconcept';
import MenuGroup from './menus/menu_groups';
import { deleteConcept, fetchCryptoPrices } from '../actions';
import CryptoChart from './crypto_chart';

const BackDropDiv = posed.div({
    visible: { opacity: 1 },
    hidden: { 
        opacity: 0,

        transition: { duration: 150},
        delay: 150
    }
});

const LogoAnimated = posed.div({
    visible: { y: 0, opacity:1,  delay: 150},
    hidden: {
        y: -50,
        opacity: 0,
        transition: { duration: 100},
    }
});

const ModalAnimated = posed.div({
    visible: { y: '-50%', x:'-50%', opacity: 1 },
    hidden: {
        x: '-50%',
        y: '-70%',
        opacity: 0,

        transition: { duration: 150},
        delay: 150
    }
});

class ConceptDetails extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            open: false,
            animation: false
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderFormDeleteConcept = this.renderFormDeleteConcept.bind(this);
        this.renderContent = this.renderContent.bind(this);
        this.handleAnimationClose = this.handleAnimationClose.bind(this);
        this.renderAnimatedBackdrop = this.renderAnimatedBackdrop.bind(this);
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeConcept) {
          this.setState({
            open: nextProps.activeConcept.open,
            animation: nextProps.activeConcept.open,
          })
        }
    }

    handleDelete(concept){
        if( confirm('Sure want to delete?')) {
            this.props.deleteConcept(concept);
        }
    }

    handleClose = () => {
        this.setState({ animation: false });
    };

    handleAnimationClose() {
        if (this.state.animation == false)
            this.setState({ open: false });
    }

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
                <div style={{marginBottom:'10px'}}>
                    <h2>Pro's</h2>
                    {this.renderList(pros, <PlusIcon color="primary" className="trade-off-icon"/>)}
                </div>
                <div style={{marginBottom:'10px'}}>
                    <h2>Con's</h2>
                    {this.renderList(cons, <MinusIcon color="secondary" className="trade-off-icon"/>)}
                </div>
            </div>
        )
    }

    renderCryptoChart(meta){
        if (!meta.symbol)
            return (<div></div>);

        return (
            <CryptoChart symbol={meta.symbol} />
        )
    }

    renderFormEditConcept(component) {
        const { concept } = component;

        return (
            <FormEditConcept
                groupId={concept.group.id}
                groupName={concept.group.name}
                key="editConcept"
                logo_url={concept.logo_url} // hacky but works, used in the constructor
                initialValues={{...concept, groupId: concept.group.id}}
            />
        );
    }

    renderFormDeleteConcept(component) {
        const { concept } = component;

        return (
            <MenuItem
                color="secondary" 
                key="deleteConcept"
                onClick={() => this.handleDelete(concept)}>
                Delete concept
            </MenuItem>
        );
    }

    renderContent(concept, headerBackground){
        let md_summary = `<div></div>`;
        if (concept.details.summary)
            md_summary = markdown.parse(concept.details.summary);

        return (
            <Card className="concept-detail-card">
                {/* contains the concept logo / image / picture */}
                <LogoAnimated
                    className="logo-animated-anim"
                    initialPose='hidden'
                    // this is a child pose-div, meaning the 'pose' props are pased from the parents
                >
                    <Paper
                        elevation={3}
                        className="concept-detail-logo"
                    >
                        <img src={concept.logo_url} />
                    </Paper>
                </LogoAnimated>

                <CardHeader
                    className="concept-detail-card-header"
                    title={concept.details.title}
                    style={{backgroundColor: headerBackground, background: headerBackground}}
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
                                <Row className="details-column">
                                    {this.renderCryptoChart(concept.meta)}
                                </Row>
                                {/* Reference links */}
                                <Row className="details-column">
                                    {this.renderReferenceLinks(concept.details)}
                                </Row>
                                {/* Pro's & Cons */}
                                <Row className="details-column">
                                    {this.renderProsAndCons(concept.details)}
                                </Row>                         
                            </Col>
                        </Row>
                        
                    </Grid>
                </CardContent>
                <CardActions
                    // style={{float:'right'}}
                >
                    <FormEditConcept
                        groupId={concept.group.id}
                        groupName={concept.group.name}
                        key="editConcept"
                        logo_url={concept.logo_url} // hacky but works, used in the constructor
                        initialValues={{...concept, groupId: concept.group.id}}
                    />
                    <Button
                        type="Back" 
                        onClick={this.handleClose}>
                        Back
                    </Button>                
                </CardActions>
            </Card>        
        );
    }

    renderAnimatedBackdrop() {
        return (
            <BackDropDiv 
                className="concept-detail-backdrop"
                onClick={this.handleClose}

                initialPose='hidden'
                pose={this.state.animation ? 'visible' : 'hidden'}
            />
        );
    }

    render() {
        // check if activeConcepts are ready to be viewed
        const { activeConcept } = this.props;
        const show_details = !this.props.activeConcept ? false : true;

        // assign open/ anchorEl/concept if activeConcept exists.. otherwise apply default values
        const open = show_details ? activeConcept.open : false;
        const concept = show_details ? activeConcept.concept : null;
        const headerBackground = show_details ? activeConcept.background : null;

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
                    BackdropComponent={this.renderAnimatedBackdrop}
                    disableAutoFocus={false}
                >
                    <ModalAnimated
                        className="concept-detail-card-div"
                        initialPose='hidden'
                        pose={this.state.animation ? 'visible' : 'hidden'}
                        onPoseComplete={this.handleAnimationClose}
                    >
                        {this.renderContent(concept, headerBackground)}
                    </ModalAnimated>
                </Modal>
            
        );
    }
}

function mapStateToProps (state) {
    return {
        activeConcept: state.activeConcept
    };
}

export default connect( mapStateToProps, {deleteConcept, fetchCryptoPrices})(ConceptDetails);



