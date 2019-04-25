import React, { Component } from 'react';
import { connect } from 'react-redux';

// material ui
import { Paper, Card, CardContent, CardHeader } from '@material-ui/core';

export default class NewUser extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <Card>
                    <CardHeader>

                    </CardHeader>
                    <CardContent>
                        {/* Display name */}
                        {/* Confirm Button */}
                        {/* This dispatches a createUserAction */}
                    </CardContent>
                </Card>
            </div>
        )
    }
}