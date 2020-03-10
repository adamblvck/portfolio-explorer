import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

export default class Board extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="footer">
                <Typography variant="subtitle1" className="footer-typography">
                    Powered by <img className="footer-image" src="http://valion.company/images/Valion.svg">
                    </img>
                </Typography>
            </div>
        );
    }
}