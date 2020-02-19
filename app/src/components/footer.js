import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

export default class Bubble extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="footer">
                <Typography variant="subtitle1" className="footer-typography">
                    Powered by <img className="footer-image" src="http://www.smartie.be/wp-content/uploads/2019/04/Logo-Text-Shadow-LQ.png">
                    </img>
                </Typography>
            </div>
        );
    }
}