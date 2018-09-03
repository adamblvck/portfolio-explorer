import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import { Field, FieldArray, FormSection, reduxForm } from 'redux-form';

import { connect } from 'react-redux';
import { addConcept } from '../../actions'

class FormAddConcept extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderReferenceDetails = this.renderReferenceDetails.bind(this);
    }

    handleOpen = () => {
        this.setState({ open: true });
    };
    
    handleClose = () => {
        this.setState({ open: false });
    };

    renderField(field) {
        const { meta : { touched, error } } = field;
        const className = `form-group ${touched && error ? 'has-danger' : ''}`;

        return (
            <div className={className}>
                <label>{field.label}</label>
                <input 
                    className="form-control"
                    type="text"
                    {...field.input}
                />
                <div className="text-help">{touched ? error : ''}</div>
            </div>
        );
    }

    renderTextField(field) {
        const { meta : { touched, error } } = field;
        const className = `form-group ${touched && error ? 'has-danger' : ''}`;

        return (
            <div className={className}>
                <label>{field.label}</label>
                <textarea 
                    className="form-control"
                    type="text"
                    {...field.input}
                />
                <div className="text-help">{touched ? error : ''}</div>
            </div>
        );
    }

    onSubmit(values, groupId) {
        console.log("Form value:", values, groupId);
        // this.props.createPost(values, () => { // callback function
        //     this.props.history.push('/'); // instantly move to root route
        // });
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
                    >Add Concept
                </Button>

                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div className="form-add-concept">
                        <Paper>
                            <Typography gutterBottom variant="title" component="h1" align="center">
                                Adding new concept to "{this.props.groupName}"
                            </Typography>
                            <form onSubmit={ handleSubmit( (values)=>{this.onSubmit(values, this.props.groupId);} ) }>
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
                                    label="Group ID"
                                    name="groupId"
                                    component={this.renderField}
                                />
                                <button type="submit" className="btn btn-primary">Submit</button>
                                <button type="cancel" className="btn btn-danger">Cancel</button>
                            </form>
                            {/* <Typography variant="title" id="modal-title">
                            Text in a modal
                            </Typography>
                            <Typography variant="subheading" id="simple-modal-description">
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                            </Typography> */}
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

export default reduxForm({
    validate,
    form: 'NewConceptForm'
})(
    connect(null, {addConcept})(FormAddConcept)
);