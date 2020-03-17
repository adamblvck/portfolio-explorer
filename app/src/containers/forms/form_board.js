import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Typography, Modal, Button, Paper, TextField, Card, CardHeader, CardContent, CardActions} from '@material-ui/core';

import { closeBoardForm } from '../../actions/form';
import { updateBoard, addBoard } from '../../actions/board';

class FormBoard extends Component {
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
                    disabled={field.disabled}

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
        this.props.closeBoardForm();
    }

    onSubmit(values) {
        // if this is an "Update Form", call below
        if (this.props.mode == "new") {
            this.props.addBoard( { ...values } );
        }
        else if (this.props.mode == "update") {
            this.props.updateBoard( { ...values } );
        }

        // and close the form
        this.props.closeBoardForm();
    }

    render() {
        const { handleSubmit } = this.props;
        const title = this.props.mode == "update" ? "Edit Board" : (this.props.mode == "new" ? "Add Board" : "corona");
        const background_color = this.props.initialValues ? this.props.initialValues.background : "";

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

                        <Card className="form-add-concept-paper">
                            <CardHeader
                                className="concept-detail-card-header"
                                title={title}
                                style={{backgroundColor: background_color, background: background_color}}
                            />

                            <CardContent>
                                <form
                                    onSubmit={ handleSubmit( (values)=>{this.onSubmit(values)} ) }>

                                    <Field
                                        label="Name"
                                        name="name"
                                        component={this.renderField}
                                    />
                                    <Field
                                        label="Board URL identifier"
                                        name="board_id"
                                        component={this.renderField}
                                    />
                                    <Field
                                        label="Description"
                                        name="description"
                                        component={this.renderTextField}
                                    />
                                    <Field
                                        label="Background"
                                        name="background"
                                        component={this.renderField}
                                    />                                
                                    <Field
                                        label="Board ID"
                                        name="id"
                                        disabled={true}
                                        component={this.renderField}
                                    />
                                </form>
                            </CardContent>

                            <CardActions>
                                <Button type="submit" variant="outlined" color="primary">Submit</Button>
                                <Button type="button" variant="outlined" color="secondary" onClick={this.handleClose}>Cancel</Button>
                            </CardActions>

                        </Card>
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
    if (state.forms && state.forms.form_type == "board"){
        return {
            open: state.forms.open,
            mode: state.forms.mode,
            initialValues: state.forms.initialValues
        };
    }

    return {}; 
}

export default connect(mapStateToProps, { closeBoardForm, updateBoard, addBoard })(
    reduxForm({
        validate,
        form: 'EditBoard',
        enableReinitialize: true
    })(FormBoard)
);