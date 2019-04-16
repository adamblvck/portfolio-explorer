import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import { Field, FieldArray, FormSection, reduxForm } from 'redux-form';

import MenuItem from '@material-ui/core/MenuItem';

import { connect } from 'react-redux';
import { addGroup, editGroup } from '../../actions'

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

    onSubmit(values) {
        // if this is an "Update Form", call below
        if (this.props.mode == "new") {
            this.props.addGroup({ 
                ...values, 
                n_depth:this.props.n_depth, 
                parent_groupId:this.props.parent_groupId
            });
        }
        else if (this.props.mode == "update") {
            this.props.editGroup({...values });
        }
    }

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

    render() {
        const { handleSubmit } = this.props;

        return (
            <div>
                <MenuItem onClick={this.handleOpen}>
                    {this.props.label}
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
                                { this.props.mode == "update" && <p>Editing Group</p> }
                                { this.props.mode == "new" && <p>New Group</p> }
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
        {addGroup, editGroup}
    )(FormEditGroup)
);