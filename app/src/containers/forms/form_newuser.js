import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

// material ui
import { Card, CardContent, CardHeader, Button, TextField, Typography } from '@material-ui/core';

import { usernameAvailable, createUser } from '../../actions/user';
import { value } from 'popmotion';

class FormNewUser extends Component {
    constructor(props){
        super(props);

        this.state = {
            usernameavailable: false,
            user_checked: false,
            created_user: false
        }
    }

    componentWillReceiveProps(nextProps){
        // this.setState({user_checked: true});

        if (nextProps.usernameavailable !== undefined){ // if form receives props and this turns true
            // console.log("setting user_checked to true");
            // console.log(nextProps.usernameavailable);

            // if both checked and available, create the username!
            if ( nextProps.usernameavailable === true && this.state.created_user === false ){
                this.props.createUser(this.state.username);
                this.setState({user_checked: true, created_user: true});
            }
            // else, save that we've checked, and what the state is
            // if the user hasn't been created yet
            else {
                this.setState({
                    user_checked: true,
                    usernameavailable: nextProps.usernameavailable
                });
            }
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

    onSubmit(values) {
        this.setState({username: values.username});
        this.props.usernameAvailable(values.username);
    }

    render(){
        const { handleSubmit } = this.props;

        return(
            <div className="form-newuser">
                <Card>
                    <CardHeader
                        title="Create an account"
                        subheader="Choose a nickname to be able to create and edit boards and concepts"
                    />
                    <CardContent>
                        <form onSubmit={ handleSubmit( (values)=>{this.onSubmit(values)} ) }>
                                {(this.state.user_checked && !this.state.usernameavailable) && <Typography>Username taken, pick a different one!</Typography>}
                            <Field
                                label="Username"
                                name="username"
                                component={this.renderField}
                            />
                            <Button type="submit" variant="outlined" color="primary">Create Account</Button>
                        </form>
                        {/* Display name */}
                        {/* Confirm Button */}
                        {/* This dispatches a createUserAction */}
                    </CardContent>
                </Card>
            </div>
        )
    }
}

function validate(){
    const errors = {};
    return errors;
}

function mapStateToProps(state) {
    if (state.auth){
        console.log("Auth state", state.auth);
        return {
            usernameavailable: state.auth.usernameavailable,
            modified: state.auth.modified
        }
    }

    return {};
}

export default connect( mapStateToProps, { usernameAvailable, createUser })(
    reduxForm({
        validate,
        form: 'Form_NewUser',
        enableReinitialize: true
    })(FormNewUser)
);