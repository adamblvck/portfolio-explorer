import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { Typography, Modal, Button, Paper, TextField, Card, CardHeader, CardContent, CardActions, Select, MenuItem, Switch, FormGroup, FormControl, FormControlLabel, FormHelperText} from '@material-ui/core';

// actions
import { closePublishForm } from '../../actions/form';
import { updateBoardScope } from '../../actions/board';

// to make multi-column layouts
import { Grid, Row, Col } from 'react-bootstrap';

import { gradients, getTextColor } from './gradient_helper.js';
import { renderField } from './form_fields.js';

class FormPublish extends Component {
    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);

        this.state = {
            public_toggle: false
        };
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.initialValues && nextProps.initialValues.scope !== undefined) {
            if ( nextProps.initialValues.scope == 'me' || nextProps.initialValues.scope == 'private' ) {
                this.setState({ public_toggle: false });
            } else {
                this.setState({ public_toggle: true });
            }
        }
      }

    handleClose = () => {
        this.props.closePublishForm();
    }

    onSubmit = (values) => {
        const new_scope = this.state.public_toggle ? "public" : "private";

        console.log(new_scope);

        this.props.updateBoardScope( { id:values.id, scope:new_scope } );

        // // and close the form
        this.props.closePublishForm();
    }

    handlePublishToggle = () => {
        this.setState({public_toggle: !this.state.public_toggle});
    }

    renderToggle = () => {
        return(
            <FormControlLabel
                className="formcontrol-control"
                id="public-toggle"
                label="Public"
                control={
                    <Switch
                        checked={this.state.public_toggle}
                        onChange={this.handlePublishToggle}
                        name="form-control"
                        color="primary"
                    />
                }
            />
        );
    }

    render = () => {
        const { handleSubmit } = this.props;
        const title = "Publish Settings";
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

                            <form onSubmit={ handleSubmit( (values) => { this.onSubmit(values) } ) }>
                            {/* <form> */}
                                <CardContent>
                                    <Grid>
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <Typography variant="h5" >
                                                    Publish Your Board
                                                </Typography>
                                            </Col>
                                        </Row>
                                        
                                        <Row>
                                            <Col xs={12} md={12}>
                                                {this.renderToggle()}
                                            </Col>
                                        </Row>

                                        {/* Setting up this section when channels will finally come around */}
                                        {/* { this.state.public_toggle && <Row>
                                            <Col xs={12} md={12}>
                                                <Typography variant="body" >
                                                    Choose a channel to publish into
                                                </Typography>
                                                <Field
                                                    label="Channel Name"
                                                    name="scope"
                                                    component={renderField}
                                                />
                                            </Col>
                                        </Row>} */}

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

function validate(){
    const errors = {};
    return errors;
}

function mapStateToProps(state) {
    if (state.forms && state.forms.form_type == "publish") {
        return {
            open: state.forms.open,
            initialValues: state.forms.initialValues
        };
    }

    return {}; 
}

export default connect(mapStateToProps, { closePublishForm, updateBoardScope })(
    reduxForm({
        validate,
        form: 'PublishForm',
        enableReinitialize: true
    })(FormPublish)
);