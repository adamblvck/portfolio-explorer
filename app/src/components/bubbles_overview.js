import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

export default class BubblesOverview extends Component {
    constructor(props){
        super(props);
    }

    handleBlockchainClick(){
        
    }

    render(){
        return (
            <div>
                <Link to="/b/blockchain">
                    <Button type="button" color="primary">
                        Blockchain
                    </Button>
                </Link>
            </div>
        )
    }
}