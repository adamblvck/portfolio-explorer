import React, { Component } from 'react';

import { Typography, Modal, Button, Paper, TextField, CardActions} from '@material-ui/core';

import { Card,
    CardHeader,
    CardContent } from '@material-ui/core';

import { Field, FieldArray, FormSection, reduxForm } from 'redux-form';

import { connect } from 'react-redux';
import { addConcept, updateConcept } from '../../actions/concept'
import { closeConceptForm } from '../../actions/form';

// to make multi-column layouts
import { Grid, Row, Col } from 'react-bootstrap';

import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

import ReactMde from "react-mde";
import * as Showdown from "showdown";

class FormEditConcept extends Component {

    constructor(props) {
        super(props);

        this.state = {
            logo_url: "https://getrandomimage.com",
            markdown: ''
        }

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderReferenceDetails = this.renderReferenceDetails.bind(this);
        this.renderProsCons = this.renderProsCons.bind(this);
        this.renderGroupIds = this.renderGroupIds.bind(this);

        this.onNewLogoUrl = this.onNewLogoUrl.bind(this);
        this.updateMarkdown = this.updateMarkdown.bind(this);
        this.renderTextField = this.renderTextField.bind(this);
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

    renderTextField(field) {
        const { meta : { touched, error } } = field;
        const className = `form-group ${touched && error ? 'has-danger' : ''}`;

        console.log ( '...field.input', field.input );

        // const [value, setValue] = React.useState("**Hello world!!!**");
        const [selectedTab, setSelectedTab] = React.useState("write");

        const converter = new Showdown.Converter({
            tables: true,
            simplifiedAutoLink: true,
            strikethrough: true,
            tasklists: true
        });

        return (
            <div className={className}>
                <ReactMde
                    {...field.input}
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                    generateMarkdownPreview={markdown =>
                        Promise.resolve(converter.makeHtml(markdown))
                    }
                    loadSuggestions={this.loadSuggestions}
                />
                

                {/* <Editor {...field.input} language='en' /> */}

                {/* <TextField
                    id={field.name}
                    label={field.label}
                    className="form-control"
                    margin="normal"
                    multiline
                    rows="5"
                    {...field.input}
                /> */}
            </div>
        );
    }

    renderMarkdown(field) {
        const { meta : { touched, error } } = field;
        const className = `form-group ${touched && error ? 'has-danger' : ''}`;

        return (
            <MDEditor className={className} initialValue="# Hello!" onChange={console.log} />
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
                <Button variant="outlined" color="primary" type="button" onClick={() => fields.push({})}>
                    <AddRoundedIcon/> Group ID
                </Button>
                { fields.map((groupId, index) => (
                    <Grid key={index}>
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
                                <DeleteRoundedIcon></DeleteRoundedIcon>
                            </Button>
                        </Col>
                    </Grid>
                )) }
            </div>
        );
    }

    onNewLogoUrl(event) {
        this.setState({logo_url: event.target.value});
    }

    render() {
        const { handleSubmit } = this.props;

        const { activeConcept } = this.props;
        const show_details = !activeConcept ? false : true;
        const headerBackground = show_details ? activeConcept.background : null;

        // const headerBackground = 'black';

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

                        <Card className="form-add-concept-paper">

                            <form onSubmit={ handleSubmit( (values)=>{this.onSubmit(values)} ) } >

                            <CardHeader
                                className="concept-detail-card-header"
                                title={title}
                                style={{backgroundColor: headerBackground, background: headerBackground}}
                            />


                            <CardContent style={{'overflow-y':'auto', 'max-height':'500px'}}>
                                
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
                                                component={this.renderTextField}
                                                tabIndex={0}
                                            />
                                        <Row>
                                            <FieldArray 
                                                label="Group IDs"
                                                name="groupIds" 
                                                component={this.renderGroupIds} 
                                            />
                                            
                                            
                                        </Row>
                                    </Grid>
                                
                            </CardContent>

                            <CardActions>
                                <Button type="submit" variant="outlined" color="primary">Submit</Button>
                                <Button type="button" variant="outlined" color="secondary" onClick={this.handleClose}>Cancel</Button>
                            </CardActions>

                            </form>

                            {/* <Typography gutterBottom variant="title" component="h1" align="center">
                                { this.props.mode == "update" && <p>Editing Concept</p> }
                                { this.props.mode == "new" && <p>New Concept</p> }
                            </Typography> */}
                            
                        </Card>

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