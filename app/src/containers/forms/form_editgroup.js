import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import { Field, FieldArray, FormSection, reduxForm } from 'redux-form';

import MenuItem from '@material-ui/core/MenuItem';

import { connect } from 'react-redux';
import { editGroup } from '../../actions'

class FormEditGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
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

    onSubmit(values) {
        this.props.editGroup({ 
            ...values
        });
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <div>
                <MenuItem
                    onClick={this.handleOpen}
                >
                    {this.props.addButtonText}
                </MenuItem>
                
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div className="form-add-concept">
                        <Paper className="form-add-concept-paper">
                            <Typography gutterBottom variant="title" component="h1" align="center">
                                Edit Group
                            </Typography>
                            <form
                                onSubmit={ handleSubmit( (values)=>{this.onSubmit(values)} ) }>
                                <Field
                                    label="Name"
                                    name="name"
                                    component={this.renderField}
                                />
                                <Field
                                    label="Color"
                                    name="color"
                                    component={this.renderField}
                                />
                                <Field
                                    label="Background"
                                    name="background"
                                    component={this.renderField}
                                />
                                <Field
                                    label="Description"
                                    name="description"
                                    component={this.renderTextField}
                                />
                                <Field
                                    label="N Depth"
                                    name="n_depth"
                                    component={this.renderField}
                                />
                                <Field
                                    label="Parent Group ID"
                                    name="parent_groupId"
                                    component={this.renderField}
                                />
                                <Field
                                    label="Bubble  ID"
                                    name="bubble_id"
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

export default reduxForm({
    validate,
    form: 'EditGroupForm'
})(
    connect(
        null,
        {editGroup}
    )(FormEditGroup)
);