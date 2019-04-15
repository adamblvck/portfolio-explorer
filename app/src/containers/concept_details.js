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

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

// import icons
import PlusIcon from '@material-ui/icons/AddCircleRounded';
import MinusIcon from '@material-ui/icons/RemoveCircleRounded';
import LinkIcon from '@material-ui/icons/LinkRounded';

// my components
import FormEditConcept from './forms/form_editconcept';
import MenuGroup from './menus/menu_groups';
import { deleteConcept, fetchCryptoPrices } from '../actions';
import CryptoChart from './crypto_chart';
import MindmapViewer from './mindmap_viewer';

// charting components
import ReactEcharts from 'echarts-for-react'; 

const BackDropDiv = posed.div({
    visible: { opacity: 1 },
    hidden: { 
        opacity: 0,

        transition: { duration: 150},
        delay: 150
    }
});

const transition = {
    duration: 400,
    ease: [0.08, 0.69, 0.2, 0.99]
  };
  
const Frame = posed.div({
    summary: {
        applyAtEnd: { display: 'none' },
        opacity: 0,
        zIndex: 3
    },
    fullscreen: {
        applyAtStart: { display: 'block' },
        opacity: 1,
        zIndex: 3
    }
});

const SummaryDiv = posed.div({
    summary:{
        width: 'auto',
        height: 'auto',
        position: 'static',
        transition: transition,
        flip: true,
    },
    fullscreen: {
        width: '100vw',
        height: '100vh',

        flip: true,

        transition: transition,

        position: 'fixed',
        left: 0,
        bottom: 0,
        right: 0,
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
    visible: { 
        y: 0, 
        // top: '25%',
        opacity: 1
    },
    hidden: {
        y: -50,
        // top: '20%',
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
            animation: false,
            fullscreen: false
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleAnimationClose = this.handleAnimationClose.bind(this);
        this.handleShowMore = this.handleShowMore.bind(this);

        this.renderFormDeleteConcept = this.renderFormDeleteConcept.bind(this);
        this.renderContentCard = this.renderContentCard.bind(this);
        this.renderAnimatedBackdrop = this.renderAnimatedBackdrop.bind(this);
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeConcept) {
          this.setState({
            open: nextProps.activeConcept.open,
            animation: nextProps.activeConcept.open,
            fullscreen: false
          })
        }
    }

    handleDelete(concept){
        if( confirm('Sure want to delete?')) {
            this.setState({open:false});
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

    handleShowMore() {
        this.setState({ fullscreen: !this.state.fullscreen });
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

                mode="update"
                label="Edit"
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

    renderFullscreenMarkdown(title, headerBackground, md_copy){
        return (
            <Card className="fullscreen-read-card">
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
                        <IconButton onClick={this.handleShowMore} >
                            <CloseIcon/>
                        </IconButton>
                    }
                />
                <CardContent className="fullscreen-read-card-content">
                    <div 
                        dangerouslySetInnerHTML={{__html:md_copy}}
                    ></div>
                </CardContent>
                <CardActions>
                    <Button 
                        onClick={this.handleShowMore}
                        variant="outlined"
                    >
                        Close
                    </Button>
                </CardActions>
            </Card>
        )
    }

    renderCardHeader(concept, headerBackground){
        return (<CardHeader
            className="concept-detail-card-header"
            title={concept.name}
            style={{backgroundColor: headerBackground, background: headerBackground}}
            action={
                this.props.isAuthenticated && <MenuGroup 
                        isAuthenticated={this.props.isAuthenticated}
                        components={ [
                            {
                                label:"Edit Concept",
                                concept: concept,
                                render:this.renderFormEditConcept,
                                needAuth: true
                            },
                            {
                                label:"Delete Concept",
                                concept: concept,
                                render:this.renderFormDeleteConcept,
                                needAuth: true
                            }
                        ]}
                    />
                }
        />);
    }

    renderCardContent(concept, headerBackground){
        let md_summary = `<div></div>`;

        if (concept.details.summary)
            md_summary = markdown.parse(concept.details.summary);

        const { short_copy, mindmap } = concept.details;

        return (<CardContent className="concept-detail-content">
            <Grid>
                <Row>
                    <Col xs={12} md={6}>
                        {/* render summary */}
                        {/* <div dangerouslySetInnerHTML={{__html:md_summary}} /> */}

                        {/* <Frame 
                            pose={this.state.fullscreen ? 'fullscreen' : 'summary'} 
                            initialPose='summary'
                            className="frame"
                            style={{
                                zIndex: 3
                            }}
                        /> */}
                        <SummaryDiv
                            className="summary-animated-anim"
                            initialPose='summary'
                            pose={this.state.fullscreen ? 'fullscreen' : 'summary'}
                            style={{
                                zIndex: 3
                            }}
                        >
                            {/* Render short_copy or markdown in fullscreen */}
                            <div>

                                {this.state.fullscreen && this.renderFullscreenMarkdown(concept.name, headerBackground, md_summary)}

                                { !this.state.fullscreen && (<h3 className="concept-short-copy-header">{short_copy}</h3>) }

                            </div>
                            <div
                                style={{textAlign: 'center'}}
                            >
                                {!this.state.fullscreen && 
                                    (<Button onClick={this.handleShowMore} variant="outlined">
                                        Read More
                                    </Button>)
                                }
                            </div>
                        </SummaryDiv>
                        

                    </Col>
                    <Col xs={12} md={6}>
                    
                        <Row className="details-column">
                            <MindmapViewer mindmapData={mindmap}/>
                        </Row>

                        <Row className="details-column">
                            {/* {this.renderCryptoChart(concept.meta)} */}
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
        </CardContent>);
    }
    
    renderCardActions(concept){
        return (
            <CardActions
                // style={{float:'right'}}
            >
                {this.props.isAuthenticated && <FormEditConcept
                    groupId={concept.group.id}
                    groupName={concept.group.name}
                    key="editConcept"
                    logo_url={concept.logo_url} // hacky but works, used in the constructor
                    initialValues={{...concept}} // , groupIds: concept.group.id
                    label="Edit"
                    mode="update"
                />}
                <Button
                    type="Back" 
                    onClick={this.handleClose}>
                    Back
                </Button>                
            </CardActions>
        );
    }

    renderContentCard(concept, headerBackground){
        // if (concept !== undefined) {
        //     return (<div></div>);
        // }

        console.log(concept);

        return (
            <Card className="concept-detail-card">
                {/* contains the concept logo / image / picture */}
                <LogoAnimated
                    className="logo-animated-anim"
                    initialPose='hidden'
                    // this is a child pose-div, meaning the 'pose' props are pased from the parents
                >
                    <Paper elevation={3} className="concept-detail-logo">
                        <img src={concept.logo_url} />
                    </Paper>
                </LogoAnimated>

                {/* Card Header */}
                {this.renderCardHeader(concept,  headerBackground)}

                {/* Card Content */}
                {this.renderCardContent(concept, headerBackground)}

                {/* Card Actions, on the bottom */}
                {this.renderCardActions(concept)}
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
        const { activeConcept, concepts } = this.props;
        const show_details = !activeConcept ? false : true;

        // assign open/ anchorEl/concept if activeConcept exists.. otherwise apply default values
        const headerBackground = show_details ? activeConcept.background : null;

        if ((!show_details) && (!this.state.open)){
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
                    {/* Render Content Card */}
                    {this.renderContentCard(this.props.concept, headerBackground)}
                </ModalAnimated>
            </Modal>                            
        );
    }
}

function mapStateToProps (state) {
    if (state.activeConcept) {
        return {
            concept: state.groups.concepts[state.activeConcept.concept.conceptID],
            activeConcept: state.activeConcept,
            concepts: state.groups.concepts
        };
    }

    return {
        concepts: state.groups.concepts,
        modified: state.groups.modified
    };
}

export default connect( mapStateToProps, {deleteConcept, fetchCryptoPrices})(ConceptDetails);



