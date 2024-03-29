import React, { Component } from 'react';

import { Typography, Modal, Button, Paper, TextField, Card, CardHeader, CardActions, CardContent} from '@material-ui/core';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { Field, FieldArray, FormSection, reduxForm } from 'redux-form';

import { connect } from 'react-redux';
import { addGroup, editGroup } from '../../actions/group'
import { closeGroupForm } from '../../actions/form';
import { Grid, Row, Col } from 'react-bootstrap';

import { gradients, getTextColor } from './gradient_helper.js';
import { renderField, renderTextField, renderGradientField } from './form_fields.js';

class FormEditGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            display_option: "header_with_icons"
        }

        this.handleClose = this.handleClose.bind(this);
        this.handle_sectionTypeChange = this.handle_sectionTypeChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.open == true){ // if form receives props and this turns true
            this.setState({
                open: nextProps.open
            });
        }

        if (nextProps.initialValues !== undefined && nextProps.initialValues.display_option !== undefined){ // if form receives props and this turns true
            // if display_type equals to null, then use the default value of `header_with_icon`
            const { display_option } = nextProps.initialValues;
            console.log("initialValues.display_option", nextProps.initialValues.display_option);
            this.setState({ display_option: display_option == null ? "header_with_icons" : display_option });
        }
    }
    
    handleClose = () => {
        this.props.closeGroupForm();
    };

    onSubmit(values) {

        // const {display_option} = this.state;
        const submit_object = { ...values, display_option: this.state.display_option };

        // if this is an "Update Form", call below
        if (this.props.mode == "new") {
            this.props.addGroup(submit_object);
        }
        else
        if (this.props.mode == "update") {
            this.props.editGroup( submit_object );
        }

        // and close form
        this.props.closeGroupForm();
    }

    render_groupForm () {
        return (
            <Grid>
                <Row>
                    <Col xs={12} md={12}>
                        <Field
                            label="Name"
                            name="name"
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
                            label="Parent Group ID"
                            name="parent_groupId"
                            component={renderField}
                            disabled={true}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6}>
                        <Field
                            label="Board ID"
                            name="board_id"
                            component={renderField}
                            disabled={true}
                        />
                    </Col>
                    <Col xs={12} md={6}>
                        <Field
                            label="Board DB ID"
                            name="_boardId"
                            component={renderField}
                            disabled={true}
                        />
                    </Col>
                </Row>
            </Grid>
        );
    };

    handle_sectionTypeChange (event) {
        const { value } = event.target;
        this.setState({
            display_option: value
        });
    }

    render_conceptForm () {

        console.log("this.state.display_option", this.state.display_option);

        return (
            <Grid>
                <Row>
                    <Col xs={12} md={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Choose Section Type</FormLabel>
                            <RadioGroup value={this.state.display_option} aria-label="section-type" name="section-type" onChange={this.handle_sectionTypeChange}>
                                <FormControlLabel value="header_with_icons" control={<Radio />} label="Header + Icon Grid" />
                                <FormControlLabel value="markdown" control={<Radio />} label="Markdown" />
                            </RadioGroup>
                        </FormControl>
                    </Col>
                </Row>

                {/* Allow user to fill in header if he chose this option */}
                { this.state.display_option == "header_with_icons" &&
                <Row>
                    <Col xs={12} md={12}>
                        <Field
                            label="Header"
                            name="name"
                            component={renderField}
                        />
                    </Col>
                </Row>
                }
                
                {/* Allow user to fill in markdown if he chose this option */}
                { this.state.display_option == "markdown" &&
                <Row>
                    <Col xs={12} md={12}>
                        <Field
                            label="Markdown"
                            name="description"
                            component={renderTextField}
                        />
                    </Col>
                </Row>
                }
                
            </Grid>
        );
    };

    render() {
        const { handleSubmit } = this.props;
        const title = this.props.mode == "update" ? "Edit Group" : (this.props.mode == "new" ? "Add Group" : "corona");
        const background_color = this.props.initialValues ? this.props.initialValues.background : "";
        const text_color = background_color != "" ? getTextColor(background_color) : 'white';

        // We have 2 types of "form_groups"
        // 'group' - edits or creates a new group
        // 'subgroup' - edits or creates a section (subgroup)

        console.log(this.props.type);

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
                                style={{backgroundColor: background_color, background: background_color, color: text_color}}
                            />
                            <form onSubmit={ handleSubmit( (values)=>{this.onSubmit(values)} ) }>

                                {/* render different card content depending on type (value passeed through from invoker) */}
                                <CardContent>
                                    { this.props.type == "group" && this.render_groupForm()}
                                    { this.props.type == "subgroup" && this.render_conceptForm()}
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
            type: state.forms.type,
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