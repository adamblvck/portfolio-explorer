import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Typography, Modal, Button, Paper, TextField, Card, CardHeader, CardContent, CardActions, Select, MenuItem, FormControl, FormHelperText} from '@material-ui/core';

import { closeBoardForm } from '../../actions/form';
import { updateBoard, addBoard } from '../../actions/board';

// to make multi-column layouts
import { Grid, Row, Col } from 'react-bootstrap';

import { gradients, getTextColor } from './gradient_helper.js';
import { renderField, renderTextField, renderGradientField } from './form_fields.js';

class FormBoard extends Component {
    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
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
        const text_color = background_color != "" ? getTextColor(background_color) : 'white';

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
                                style={{backgroundColor: background_color, background: background_color, color: text_color}}
                            />

                            <form onSubmit={ handleSubmit( (values)=>{this.onSubmit(values)} ) }>
                                <CardContent>
                                    <Grid>
                                        <Row>
                                            <Col xs={12} md={6}>
                                                <Field
                                                    label="Name"
                                                    name="name"
                                                    component={renderField}
                                                />
                                            </Col>
                                            <Col xs={12} md={6}>
                                            <Field
                                                label="Board URL Identifier - /b/..."
                                                name="board_id"
                                                component={renderField}
                                            />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <Field
                                                    label="Description"
                                                    name="description"
                                                    component={renderTextField}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <Field
                                                    label="Background"
                                                    name="background"
                                                    component={renderGradientField}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <Field
                                                    label="Board ID"
                                                    name="id"
                                                    disabled={true}
                                                    component={renderField}
                                                />
                                            </Col>
                                        </Row>
                                    </Grid>
                                    
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

function validate () {
    const errors = {};
    return errors;
}

function mapStateToProps (state) {
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