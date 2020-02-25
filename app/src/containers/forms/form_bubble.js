import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Typography, Modal, Button, Paper, TextField} from '@material-ui/core';

import { closeBubbleForm } from '../../actions/form';
import { updateBubble, addBubble } from '../../actions/board';

class FormBubble extends Component {
    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
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

    handleClose() {
        this.props.closeBubbleForm();
    }

    onSubmit(values) {
        // if this is an "Update Form", call below
        if (this.props.mode == "new") {
            this.props.addBubble( { ...values } );
        }
        else if (this.props.mode == "update") {
            this.props.updateBubble( { ...values } );
        }

        // and close the form
        this.props.closeBubbleForm();
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <div>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"

                    // Both props and state need to be "open" to show the form
                    open={this.props.open}
                    onClose={this.handleClose}
                >
                    <div className="form-add-concept">
                        <Paper className="form-add-concept-paper">
                            <Typography gutterBottom variant="title" component="h1" align="center">
                                { this.props.mode == "update" && <p>Editing Bubble</p> }
                                { this.props.mode == "new" && <p>New Bubble</p> }
                            </Typography>
                            <form
                                onSubmit={ handleSubmit( (values)=>{this.onSubmit(values)} ) }>

                                <Field
                                    label="Name"
                                    name="name"
                                    component={this.renderField}
                                />
                                <Field
                                    label="Bubble ID"
                                    name="bubble_id"
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
                                <Button type="submit" variant="outlined" color="primary">Submit</Button>
                                <Button type="button" variant="outlined" color="secondary" onClick={this.handleClose}>Cancel</Button>
                            </form>
                        </Paper>
                    </div>
                </Modal>
            </div>
        );
    }
}

function validate(){
    const errors = {};
    return errors;
}

function mapStateToProps(state) {
    if (state.forms && state.forms.form_type == "bubble"){
        return {
            open: state.forms.open,
            mode: state.forms.mode,
            initialValues: state.forms.initialValues
        };
    }

    return {}; 
}

export default connect(mapStateToProps, { closeBubbleForm, updateBubble, addBubble })(
    reduxForm({
        validate,
        form: 'EditBubble',
        enableReinitialize: true
    })(FormBubble)
);