import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import { Field, FieldArray, FormSection, reduxForm } from 'redux-form';

import { connect } from 'react-redux';
import { updateConcept } from '../../actions'

const initValsTest = `{"name":"a","logo_url":"b","meta":{"color":"c"},"details":{"title":"d","summary":"e\n\n#  fuk the police","reference_links":[{"name":"testboi","url":"accurate"}]},"groupId":"5b898603fb1d5855aad156d2"}`;

class FormEditConcept extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderReferenceDetails = this.renderReferenceDetails.bind(this);
    }

    // Event Handlers

    handleOpen = () => {
        this.setState({ open: true });
    };
    
    handleClose = () => {
        this.setState({ open: false });
    };

    onSubmit(values, groupId) {
        // console.log("Form value:", values, groupId);
        this.props.updateConcept( values); // { ...values, groupId: groupId } );
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

    renderReferenceDetails( { fields, meta: { error, submitFailed } } ) {
        return (
            <div>
                <button type="button" onClick={() => fields.push({})}>
                    Add Link
                </button>
                { fields.map((link, index) => (
                    <li key={index}>
                        <button type="button" onClick={() => fields.remove(index)} title="Remove Detail">
                            Remove group
                        </button>
                        <h4>Reference Link #{index + 1}</h4>
                        <Field
                            name={`${link}.name`}
                            type="text"
                            component={this.renderField}
                            label="Link Name"
                        />
                        <Field
                            name={`${link}.url`}
                            type="text"
                            component={this.renderField}
                            label="url"
                        />
                    </li>
                )) }
            </div>
        );
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <div>
                <Button
                    className="addConcep-btn"
                    onClick={this.handleOpen}
                    color="primary"
                >Edit</Button>

                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div className="form-add-concept">
                        <Paper className="form-add-concept-paper">
                            <Typography gutterBottom variant="title" component="h1" align="center">
                                Adding new concept to "{this.props.groupName}"
                                Adding new concept to "{this.props.groupId}"
                            </Typography>
                            <form
                                onSubmit={ handleSubmit( (values)=>{this.onSubmit(values, this.props.groupId);} ) }>
                                <Field
                                    label="Name"
                                    name="name"
                                    component={this.renderField}
                                />
                                <Field
                                    label="Logo URL"
                                    name="logo_url"
                                    component={this.renderField}
                                />

                                <FormSection name="meta">
                                    <Field
                                        label="Color"
                                        name="color"
                                        component={this.renderField}
                                    />
                                </FormSection>

                                <FormSection name="details">
                                    <Field
                                        label="Title"
                                        name="title"
                                        component={this.renderField}
                                    />
                                    <Field
                                        label="Summary"
                                        name="summary"
                                        component={this.renderTextField}
                                    />
                                    <FieldArray name="reference_links" component={this.renderReferenceDetails} />
                                </FormSection>
                                
                                <Field
                                    label="Group ID (Only if you want to change the group"
                                    name="groupId"
                                    component={this.renderField}
                                />
                                
                                <Button type="submit" variant="outlined" color="primary">Submit</Button>
                                <Button type="cancel" variant="outlined" color="secondary" onClick={this.handleClose}>Cancel</Button>
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

function mapStateToProps(state, ownProps) {
    return {
        initialValues: initValsTest
    }    
}

export default reduxForm({
    validate,
    form: 'EditConceptForm'
})(
    connect(
        mapStateToProps,
        {updateConcept}
    )(FormEditConcept)
);