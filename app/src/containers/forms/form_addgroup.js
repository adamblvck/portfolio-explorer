import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import { Field, FieldArray, FormSection, reduxForm } from 'redux-form';

import { connect } from 'react-redux';
import { addGroup } from '../../actions'

class FormAddGroup extends Component {
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
        // console.log("Form value:", values, groupId);
        //console.log(this.props.n_depth);
        //console.log(this.props.parent_groupId);
        this.props.addGroup({ 
            ...values, 
            n_depth:this.props.n_depth, 
            parent_groupId:this.props.parent_groupId
        });
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <div>
                <Button
                    className="addGroup-btn"
                    onClick={this.handleOpen}
                    color="primary"
                    variant="outlined"
                >
                    {this.props.addButtonText}
                </Button>

                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div className="form-add-concept">
                        <Paper className="form-add-concept-paper">
                            <Typography gutterBottom variant="title" component="h1" align="center">
                                Add new group
                            </Typography>
                            <form
                                onSubmit={ handleSubmit( (values)=>{this.onSubmit(values, this.props.groupId);} ) }>
                                <Field
                                    label="Name"
                                    name="name"
                                    component={this.renderField}
                                />
                                <Field
                                    label="Sector"
                                    name="sector"
                                    component={this.renderField}
                                />
                                <Field
                                    label="Description"
                                    name="description"
                                    component={this.renderTextField}
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
    form: 'NewGroupForm'
})(
    connect(
        null,
        {addGroup}
    )(FormAddGroup)
);