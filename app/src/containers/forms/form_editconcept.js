import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import { Field, FieldArray, FormSection, reduxForm } from 'redux-form';

import { connect } from 'react-redux';
import { updateConcept } from '../../actions'

// to make multi-column layouts
import { Grid, Row, Col } from 'react-bootstrap';

import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

const initValsTest = `{"name":"a","logo_url":"b","meta":{"color":"c"},"details":{"title":"d","summary":"e\n\n#  fuk the police","reference_links":[{"name":"testboi","url":"accurate"}]},"groupId":"5b898603fb1d5855aad156d2"}`;

class FormEditConcept extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            logo_url: props.logo_url
        }

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderReferenceDetails = this.renderReferenceDetails.bind(this);
        this.renderProsCons = this.renderProsCons.bind(this);
        this.renderGroupIds = this.renderGroupIds.bind(this);

        this.onNewLogoUrl = this.onNewLogoUrl.bind(this);
    }

    // Event Handlers

    handleOpen = () => {
        this.setState({ open: true });
    };
    
    handleClose = () => {
        this.setState({ open: false });
    };

    onSubmit(values, groupId) {
        this.props.updateConcept( values); // { ...values, groupId: groupId } );
    }

    // Render functions

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

    renderProsCons({ fields, meta: { error, submitFailed } } ) {
        const fieldName = fields.name.split('.').pop(); // get the last part of the component name, which is 'pros' or 'cons'

        return (
            <div>
                <Button type="button" variant="outlined" color="primary" onClick={() => fields.push({})}>
                    <AddRoundedIcon/> {fieldName}
                </Button><br/>
                { fields.map((argument, index) => (
                    <Grid key={index}>
                        <Col xs={10} md={10}>
                            <Field
                                name={argument}
                                type="text"
                                component={this.renderField}
                                label={`${fieldName} #${index + 1}`}
                            />
                        </Col>
                        <Col xs={1} md={1}>
                            <Button type="button" variant="outlined" color="secondary" onClick={() => fields.remove(index)} title="Remove Detail">
                                <DeleteRoundedIcon></DeleteRoundedIcon>
                            </Button>
                        </Col>
                    </Grid>
                )) }
            </div>
        );
    }

    renderReferenceDetails( { fields, meta: { error, submitFailed } } ) {
        return (
            <div>
                <Button variant="outlined" color="primary" type="button" onClick={() => fields.push({})}>
                    <AddRoundedIcon/> Link
                </Button>
                { fields.map((link, index) => (
                    <Grid key={index}>
                        <Col xs={10} md={10}>
                            <Field
                                name={`${link}.name`}
                                type="text"
                                component={this.renderField}
                                label={`Link Name #${index}`}
                            />
                            <Field
                                name={`${link}.url`}
                                type="text"
                                component={this.renderField}
                                label="url"
                            />
                        </Col>
                        <Col xs={1} md={1}>
                            <Button type="button" variant="outlined" color="secondary" onClick={() => fields.remove(index)} title="Remove Detail">
                                <DeleteRoundedIcon></DeleteRoundedIcon>
                            </Button>
                        </Col>
                    </Grid>
                )) }
            </div>
        );
    }

    renderGroupIds( { fields, meta: { error, submitFailed } } ) {
        return (
            <div>
                <Button variant="outlined" color="primary" type="button" onClick={() => fields.push({})}>
                    <AddRoundedIcon/> Group ID
                </Button>
                { fields.map((groupId, index) => (
                    <Grid key={index}>
                        <Col xs={10} md={10}>
                            <Field
                                name={groupId}
                                type="text"
                                component={this.renderField}
                                label={`groupID #${index}`}
                            />
                        </Col>
                        <Col xs={1} md={1}>
                            <Button type="button" variant="outlined" color="secondary" onClick={() => fields.remove(index)} title="Remove groupID">
                                <DeleteRoundedIcon></DeleteRoundedIcon>
                            </Button>
                        </Col>
                    </Grid>
                )) }
            </div>
        );
    }

    onNewLogoUrl(event) {
        this.setState({logo_url: event.target.value});
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <div>
                {/* <MenuItem
                    tabIndex={-1}
                    onClick={this.handleOpen}
                >
                    Edit
                </MenuItem> */}

                <Button 
                    tabIndex={-1}
                    onClick={this.handleOpen}
                >
                    Edit
                </Button>

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
                                Editing concept
                            </Typography>
                            <form
                                onSubmit={ handleSubmit( (values)=>{this.onSubmit(values, this.props.groupId);} ) }>
                                <img className="concept-logo-small" src={this.state.logo_url}></img>
                                <Field
                                    label="Name"
                                    name="name"
                                    component={this.renderField}
                                    tabIndex={0}
                                />
                                <Field
                                    label="Logo URL"
                                    name="logo_url"
                                    component={this.renderField}
                                    onChange={this.onNewLogoUrl}
                                    tabIndex={1}
                                />

                                <FormSection name="meta">
                                    <Field
                                        label="Header Color"
                                        name="color"
                                        component={this.renderField}
                                    />
                                    <Field
                                        label="Currency Symbol (if applicable)"
                                        name="symbol"
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
                                        label="Short Copy"
                                        name="short_copy"
                                        component={this.renderTextField}
                                    />
                                    <Field
                                        label="Summary"
                                        name="summary"
                                        component={this.renderTextField}
                                    />

                                    <FormSection name="trade_off">
                                        <FieldArray 
                                            label="Pro's"
                                            name="pros" 
                                            component={this.renderProsCons}
                                        />
                                        <FieldArray 
                                            label="Con's"
                                            name="cons" 
                                            component={this.renderProsCons}
                                        />
                                    </FormSection>

                                    <FieldArray name="reference_links" component={this.renderReferenceDetails} />
                                </FormSection>
                                
                                <FieldArray 
                                    label="Group IDs"
                                    name="groupIds" 
                                    component={this.renderGroupIds} 
                                />

                                <Field
                                    label="Group ID"
                                    name="groupId"
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

// function mapStateToProps(state, ownProps) {
//     return {
//         initialValues: initValsTest
//     }    
// }

export default reduxForm({
    validate,
    form: 'EditConceptForm'
})(
    connect(
        null,
        {updateConcept}
    )(FormEditConcept)
);