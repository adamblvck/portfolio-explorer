import React, { Component } from 'react';

import { Typography, Modal, Button, Paper, TextField, Card, CardHeader, CardActions, CardContent} from '@material-ui/core';

import { Field, FieldArray, FormSection, reduxForm } from 'redux-form';

import { connect } from 'react-redux';
import { addGroup, editGroup } from '../../actions/group'
import { closeGroupForm } from '../../actions/form';

class FormEditGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.open == true){ // if form receives props and this turns true
            this.setState({
                open: nextProps.open
            });
        }
    }

    handleOpen = () => {
        // this.setState({ open: true });
    };
    
    handleClose = () => {
        this.props.closeGroupForm();
    };

    onSubmit(values){
        // if this is an "Update Form", call below
        if (this.props.mode == "new") {
            this.props.addGroup({ ...values });
        }
        else if (this.props.mode == "update") {
            this.props.editGroup({ ...values });
        }

        // and close form
        this.props.closeGroupForm();
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
        const title = this.props.mode == "update" ? "Edit Group" : (this.props.mode == "new" ? "Add Group" : "corona");
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

                        <Card>
                            <CardHeader
                                className="concept-detail-card-header"
                                title={title}
                                style={{backgroundColor: background_color, background: background_color}}
                            />

                            <form onSubmit={ handleSubmit( (values)=>{this.onSubmit(values)} ) }>

                                <CardContent>
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
                                            label="Board ID"
                                            name="board_id"
                                            component={this.renderField}
                                        />
                                        <Field
                                            label="Board DB ID"
                                            name="_boardId"
                                            component={this.renderField}
                                        />
                                    
                                </CardContent>

                                <CardActions>
                                    <Button type="submit" variant="outlined" color="primary">Submit</Button>
                                    <Button type="button" variant="outlined" color="secondary" onClick={this.handleClose}>Cancel</Button>
                                </CardActions>

                            </form>

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
    if (state.forms && state.forms.form_type == "group"){
        return {
            open: state.forms.open,
            mode: state.forms.mode,
            initialValues: state.forms.initialValues
        };
    }

    return {};
}

export default connect(mapStateToProps, {addGroup, editGroup, closeGroupForm})(
    reduxForm({
        validate,
        form: 'EditGroupForm',
        enableReinitialize: true
    })(FormEditGroup)
);