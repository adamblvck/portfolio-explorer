import React, { Component } from 'react';

import { Typography, Modal, Button, Paper, TextField, CardActions, Collapse, IconButton} from '@material-ui/core';

import { Card,
    CardHeader,
    CardContent } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Field, FieldArray, FormSection, reduxForm } from 'redux-form';

import { connect } from 'react-redux';
import { addConcept, updateConcept } from '../../actions/concept'
import { closeConceptForm } from '../../actions/form';

// to make multi-column layouts
import { Grid, Row, Col } from 'react-bootstrap';

import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ReactMde from "react-mde";
import * as Showdown from "showdown";

const useStyles = makeStyles(theme => ({
    // root: {
    //   maxWidth: 345,
    // },
    // media: {
    //   height: 0,
    //   paddingTop: '56.25%', // 16:9
    // },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
}));

class FormEditConcept extends Component {

    constructor(props) {
        super(props);

        this.state = {
            logo_url: "https://getrandomimage.com",
            markdown: '',
            extraSettingsExpanded: false
        }

        this.converter = new Showdown.Converter({
            tables: true,
            simplifiedAutoLink: true,
            strikethrough: true,
            tasklists: true
        });

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderReferenceDetails = this.renderReferenceDetails.bind(this);
        this.renderProsCons = this.renderProsCons.bind(this);
        this.renderGroupIds = this.renderGroupIds.bind(this);

        this.onNewLogoUrl = this.onNewLogoUrl.bind(this);
        this.updateMarkdown = this.updateMarkdown.bind(this);
        this.renderMDField = this.renderMDField.bind(this);

        this.render_card = this.render_card.bind(this);
    }

    componentWillReceiveProps = (nextProps) => {
        console.log('form_concept.js nextProps', nextProps);
        if (nextProps.initialValues) {
            if (nextProps.initialValues.logo_url){
                this.setState({
                    logo_url: nextProps.initialValues.logo_url,
                    markdown: nextProps.initialValues.markdown
                });
            }
        }
    }

    // Event Handlers
    handleOpen = () => {
        // this.setState({ open: true });
    };
    
    handleClose = () => {
        this.props.closeConceptForm();
    };

    onSubmit = (values) => {
        // if this is an "Update Form", call below
        if (this.props.mode == "new") {
            this.props.addConcept( { ...values } );
        }
        else if (this.props.mode == "update") {
            this.props.updateConcept( {...values} );
        }

        // and close the form
        this.props.closeConceptForm();
    }

    // Render functions
    renderField(field) {
        const { meta : { touched, error } } = field;
        const className = `form-group ${touched && error ? 'has-danger' : ''}`;

        return (
            <div className={className}>
                <TextField
                    id={field.name}
                    label={field.label}
                    className="form-control"
                    margin="normal"
                    style={{'marginTop':'2px'}}
                    {...field.input}
                />
            </div>
        );
    }

    updateMarkdown = (markdown) => {
        // field.input.value = markdown;
    }

    loadSuggestions = (text) => {
        return new Promise((accept, reject) => {
          setTimeout(() => {
            const suggestions = [
              {
                preview: "Mindmap",
                value: "[mindmap]"
              },
              {
                preview: "Pros & Cons",
                value: "[pro-cons]"
              },
              {
                preview: "Links",
                value: "[links]"
              },
              {
                preview: "Post",
                value: "[post]"
              }
            ].filter(i => i.preview.toLowerCase().includes(text.toLowerCase()));
            accept(suggestions);
          }, 250);
        });
    }

    renderMDField(field) {
        const { meta : { touched, error } } = field;
        const className = `form-group ${touched && error ? 'has-danger' : ''}`;

        // const [value, setValue] = React.useState("**Hello world!!!**");
        const [selectedTab, setSelectedTab] = React.useState("write");

        return (
            <div className={className}>
                <ReactMde
                    {...field.input}
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                    generateMarkdownPreview={markdown =>
                        Promise.resolve(this.converter.makeHtml(markdown))
                    }
                    loadSuggestions={this.loadSuggestions}
                />
            </div>
        );
    }

    renderMarkdown(field) {
        const { meta : { touched, error } } = field;
        const className = `form-group ${touched && error ? 'has-danger' : ''}`;

        return (
            <MDEditor
                className={className}
                initialValue="# Hello!"
                onChange={console.log}
                minEditorHeight={15}
                maxEditorHeight={25}
            />
        )
    }

    renderProsCons({ fields, meta: { error, submitFailed } } ) {
        const fieldName = fields.name.split('.').pop(); // get the last part of the component name, which is 'pros' or 'cons'

        return (
            <div>
                <Button type="button" variant="outlined" color="primary" onClick={() => fields.push({})}>
                    <AddRoundedIcon/> {fieldName}
                </Button><br/>
                { fields.map((argument, index) => (
                    <Grid key={index}>
                        <Col xs={10} md={10}>
                            <Field
                                name={argument}
                                type="text"
                                component={this.renderField}
                                label={`${fieldName} #${index + 1}`}
                            />
                        </Col>
                        <Col xs={1} md={1}>
                            <Button className="delete-button-edit-form"  type="button" variant="outlined" color="secondary" onClick={() => fields.remove(index)} title="Remove Detail">
                                <DeleteRoundedIcon></DeleteRoundedIcon>
                            </Button>
                        </Col>
                    </Grid>
                )) }
            </div>
        );
    }

    renderReferenceDetails( { fields, meta: { error, submitFailed } } ) {
        return (
            <div>
                <Button variant="outlined" color="primary" type="button" onClick={() => fields.push({})}>
                    <AddRoundedIcon/> Link
                </Button>
                { fields.map((link, index) => (
                    <Grid key={index}>
                        <Col xs={5} md={5}>
                            <Field
                                name={`${link}.name`}
                                type="text"
                                component={this.renderField}
                                label={`Link #${index}`}
                            />
                        </Col>
                        <Col xs={5} md={5}>
                            <Field
                                name={`${link}.url`}
                                type="text"
                                component={this.renderField}
                                label={`URL #${index}`}
                            />
                        </Col>
                        <Col xs={1} md={1}>
                            <Button className="delete-button-edit-form" type="button" variant="outlined" color="secondary" onClick={() => fields.remove(index)} title="Remove Detail">
                                <DeleteRoundedIcon></DeleteRoundedIcon>
                            </Button>
                        </Col>
                    </Grid>
                )) }
            </div>
        );
    }

    renderGroupIds( { fields, meta: { error, submitFailed } } ) {
        return (
            <div>
                <Grid>
                    <Row>
                        <Col xs={10} md={10}/>
                        <Col xs={1} md={1}>
                            <Button className="add-group-id-button" variant="outlined" color="primary" type="button" onClick={() => fields.push({})}><AddRoundedIcon/></Button>
                        </Col>
                    </Row>

                    { fields.map((groupId, index) => (
                        <Row key={index}>
                            <Col xs={10} md={10}>
                                <Field
                                    name={groupId}
                                    type="text"
                                    component={this.renderField}
                                    label={`groupID #${index}`}
                                />
                            </Col>
                            <Col xs={1} md={1}>
                                <Button className="delete-button-edit-form"  type="button" variant="outlined" color="secondary" onClick={() => fields.remove(index)} title="Remove groupID">
                                    <DeleteRoundedIcon/>
                                </Button>
                            </Col>
                        </Row>                        
                    ))}

                </Grid>
                
                
            </div>
        );
    }

    onNewLogoUrl(event) {
        this.setState({logo_url: event.target.value});
    }

    render_card = (title) => {

        // const classes = useStyles();

        const { handleSubmit } = this.props;

        // retrieve header background for usage here in this app
        const { activeConcept } = this.props;
        const show_details = !activeConcept ? false : true;
        const headerBackground = show_details ? activeConcept.background : null;

        const { extraSettingsExpanded } = this.state // get extraSettingsExpanded

        const handleExpandClick = () => {
            this.setState({extraSettingsExpanded:!extraSettingsExpanded})
        };

        return (
        <Card className="form-add-concept-paper">
            <form onSubmit={ handleSubmit( (values)=>{this.onSubmit(values)} ) } >

                <CardHeader
                    className="concept-detail-card-header"
                    title={title}
                    style={{backgroundColor: headerBackground, background: headerBackground}}
                />

                <CardContent style={{'overflowY':'auto', 'max-height':'500px'}}>
                        <Grid>
                            <Row>
                                <Col md={2}>
                                    <Paper>
                                        <img className="concept-logo-small" src={this.state.logo_url}></img>
                                    </Paper>
                                </Col>
                                <Col md={3}>
                                    <Field
                                        label="Name"
                                        name="name"
                                        component={this.renderField}
                                        tabIndex={0}
                                    />
                                </Col>
                                <Col md={7}>
                                    <Field
                                        label="Image URL"
                                        name="logo_url"
                                        component={this.renderField}
                                        onChange={this.onNewLogoUrl}
                                        tabIndex={1}
                                    />                                            
                                </Col>
                            </Row>
                                <Field
                                    label="Markdown"
                                    name="markdown"
                                    component={this.renderMDField}
                                    tabIndex={0}
                                />
                            {/* <Row>
                                <FieldArray 
                                    label="Group IDs"
                                    name="groupIds" 
                                    component={this.renderGroupIds} 
                                />
                            </Row> */}
                        </Grid>
                </CardContent>

                <CardActions>
                    <Button type="submit" variant="outlined" color="primary">Save</Button>
                    <Button type="button" variant="outlined" color="secondary" onClick={this.handleClose}>Back</Button>
                    <IconButton
                        // className={clsx(classes.expand, {
                        //     [classes.expandOpen]: extraSettingsExpanded,
                        // })}
                        onClick={handleExpandClick}
                        aria-expanded={extraSettingsExpanded}
                        aria-label="show more"
                        style={{'marginLeft': 'auto', 'fontSize':'15px'}}
                    >More Settings  <ExpandMoreIcon /></IconButton>
                </CardActions>

                <Collapse in={extraSettingsExpanded} timeout="auto" unmountOnExit>
                    <FieldArray 
                        label="Group IDs"
                        name="groupIds" 
                        component={this.renderGroupIds} 
                    />
                </Collapse>

            </form>

            {/* <Typography gutterBottom variant="title" component="h1" align="center">
                { this.props.mode == "update" && <p>Editing Concept</p> }
                { this.props.mode == "new" && <p>New Concept</p> }
            </Typography> */}
            
        </Card>
        );
    }

    render() {
        // const handleExpandClick = () => {
        //     setExpanded(!expanded);
        // };

        // change the title depending on the mode of the form
        let title = "Edit"
        switch (this.props.mode){
            case "submit":
                title = "Editing Concept";
                break;
            case "new":
                title = "New Concept";
            default:
                title = "Edit"
        }

        return (
            <div>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.props.open}
                    onClose={this.handleClose}
                    className="forms-class"
                >
                    <div className="form-add-concept">
                        {/* <Paper className="form-add-concept-paper"> */}

                        {this.render_card(title)}

                    </div>
                </Modal>
            </div>
        );
    }
}

function validate(){
    const errors = {}

    return errors;
}

function mapStateToProps(state) {
    if (state.forms && state.forms.form_type == "concept"){
        return {
            open: state.forms.open,
            mode: state.forms.mode,
            initialValues: state.forms.initialValues,
            activeConcept: state.activeConcept, // we'll be pickup up this state variable for background color (will be filled in our application)
        };
    }
    return {}; 
}

export default connect(mapStateToProps, {addConcept, updateConcept, closeConceptForm})(
    reduxForm({
        validate,
        form: 'EditConceptForm',
        enableReinitialize: true
    })(FormEditConcept)
);