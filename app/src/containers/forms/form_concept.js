import React, { Component } from 'react';

import { Typography, Modal, Button, Paper, TextField} from '@material-ui/core';

import { Field, FieldArray, FormSection, reduxForm } from 'redux-form';

import { connect } from 'react-redux';
import { addConcept, updateConcept } from '../../actions/concept'
import { closeConceptForm } from '../../actions/form';

// to make multi-column layouts
import { Grid, Row, Col } from 'react-bootstrap';

import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

class FormEditConcept extends Component {
    constructor(props) {
        super(props);

        this.state = {
            logo_url: props.logo_url
        }

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderReferenceDetails = this.renderReferenceDetails.bind(this);
        this.renderProsCons = this.renderProsCons.bind(this);
        this.renderGroupIds = this.renderGroupIds.bind(this);

        this.onNewLogoUrl = this.onNewLogoUrl.bind(this);
    }

    // Event Handlers
    handleOpen() {
        // this.setState({ open: true });
    };
    
    handleClose() {
        this.props.closeConceptForm();
    };

    onSubmit(values) {
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

    renderTextField(field) {
        const { meta : { touched, error } } = field;
        const className = `form-group ${touched && error ? 'has-danger' : ''}`;

        return (
            <div className={className}>
                <TextField
                    id={field.name}
                    label={field.label}
                    className="form-control"
                    margin="normal"
                    multiline
                    rows="5"
                    {...field.input}
                />
            </div>
        );
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
                        <Paper className="form-add-concept-paper">
                            <Typography gutterBottom variant="title" component="h1" align="center">
                                { this.props.mode == "update" && <p>Editing Concept</p> }
                                { this.props.mode == "new" && <p>New Concept</p> }
                            </Typography>
                            <form
                                onSubmit={ handleSubmit( (values)=>{this.onSubmit(values)} ) }
                            >
                                <Grid>

                                    <Row>
                                        <Col md={2}>
                                            <img className="concept-logo-small" src={this.state.logo_url}></img>
                                        </Col>
                                        <Col md={5}>
                                            <Field
                                                label="Name"
                                                name="name"
                                                component={this.renderField}
                                                tabIndex={0}
                                            />
                                            <Field
                                                label="Logo URL"
                                                name="logo_url"
                                                component={this.renderField}
                                                onChange={this.onNewLogoUrl}
                                                tabIndex={1}
                                            />                                            
                                        </Col>
                                        <Col md={5}>
                                            <FormSection name="meta">
                                                {/* <Field
                                                    label="Header Color"
                                                    name="color"
                                                    component={this.renderField}
                                                /> */}
                                                <Field
                                                    label="Currency Symbol (if applicable)"
                                                    name="symbol"
                                                    component={this.renderField}
                                                />
                                            </FormSection>
                                        </Col>
                                    </Row>

                                        <Field
                                            label="Markdown"
                                            name="markdown"
                                            component={this.renderTextField}
                                            tabIndex={0}
                                        />

                                        <FormSection name="details">
                                            <Row>
                                                <Col md={2}/>

                                                <Col md={10}>
                                                    <Field
                                                        label="Short Copy"
                                                        name="short_copy"
                                                        component={this.renderTextField}
                                                    />
                                                    <Field
                                                        label="Mind Map"
                                                        name="mindmap"
                                                        component={this.renderTextField}
                                                    />
                                                    <Field
                                                        label="Summary"
                                                        name="summary"
                                                        component={this.renderTextField}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <FormSection name="trade_off">
                                                        <Col md={6}>
                                                            <FieldArray 
                                                                label="Pro's"
                                                                name="pros" 
                                                                component={this.renderProsCons}
                                                            />
                                                        </Col>
                                                        <Col md={6}>
                                                            <FieldArray 
                                                                label="Con's"
                                                                name="cons" 
                                                                component={this.renderProsCons}
                                                            />
                                                        </Col>
                                                    </FormSection>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <FieldArray name="reference_links" component={this.renderReferenceDetails} />
                                            </Row>
                                        </FormSection>

                                    <Row>
                                        <FieldArray 
                                            label="Group IDs"
                                            name="groupIds" 
                                            component={this.renderGroupIds} 
                                        />
                                        
                                        <Button type="submit" variant="outlined" color="primary">Submit</Button>
                                        <Button type="button" variant="outlined" color="secondary" onClick={this.handleClose}>Cancel</Button>
                                    </Row>
                                </Grid>
                            </form>
                        </Paper>
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
            initialValues: state.forms.initialValues
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