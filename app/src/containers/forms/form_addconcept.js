import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import { Field, FieldArray, FormSection, reduxForm } from 'redux-form';

import MenuItem from '@material-ui/core/MenuItem';

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

    onSubmit(values, groupId) {
        // console.log("Form value:", values, groupId);
        this.props.addConcept( { ...values, groupId: groupId } );
    }

    renderReferenceDetails( { fields, meta: { error, submitFailed } } ) {
        return (
            <div>
                <Button type="button" onClick={() => fields.push({})} color="primary">Add Reference Link</Button>
                {/* <button type="button" onClick={() => fields.push({})}>
                    Add Link
                </button> */}
                { fields.map((link, index) => (
                    <li key={index}>
                        <Button type="button" onClick={() => fields.remove(index)} ariant="outlined" color="secondary">Remove Detail</Button>
                        {/* <button type="button" onClick={() => fields.remove(index)} title="Remove Detail">
                            Remove group
                        </button> */}
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

    renderListOfInputs( { fields, meta: { error, submitFailed } } ) {
        return (
            <div>
                <Button type="button" onClick={() => fields.push({})} color="primary">Add item</Button>
                { fields.map((link, index) => (
                    <li key={index}>
                        <Button type="button" onClick={() => fields.remove(index)} ariant="outlined" color="secondary">Remove item</Button>
                        {/* <button type="button" onClick={() => fields.remove(index)} title="Remove Detail">
                            Remove group
                        </button> */}
                        <h4>Reference Link #{index + 1}</h4>
                        <Field
                            name={`${link}.url`}
                            type="text"
                            component={this.renderField}
                            label="text"
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
                <MenuItem
                    onClick={this.handleOpen}
                >
                    Add Concept
                </MenuItem>

                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                    className="forms-class"
                >
                    <div className="form-add-concept">
                        <Paper className="form-add-concept-paper">
                            <Typography gutterBottom variant="title" component="h1" align="center">
                                Adding new concept to "{this.props.groupName}"
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

                                    {/* <FormSection name="trade_off">
                                        <FieldArray name="pros" component={this.renderListOfInputs} />
                                        <FieldArray name="cons" component={this.renderListOfInputs} />
                                    </FormSection> */}

                                    <FieldArray name="reference_links" component={this.renderReferenceDetails} />
                                </FormSection>
                                
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

export default reduxForm({
    validate,
    form: 'NewConceptForm'
})(
    connect(
        null,
        {addConcept}
    )(FormAddConcept)
);