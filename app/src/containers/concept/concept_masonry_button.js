import React, { Component } from 'react';

import { connect } from 'react-redux';

// material ui
import { Paper, Card, CardContent, CardHeader } from '@material-ui/core';

// actions
import { showConceptDetail } from '../../actions/concept';

class ConceptMasonryButton extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    };

    handleClick(event) {
        const { currentTarget } = event;

        // we contain the concept in our props, so just pass on the information
        this.props.showConceptDetail( { conceptID: this.props.concept.id, background: this.props.background, open: true } );
    }

    render(){
        return (
            <div>
                <Card 
                    //style={{zIndex:zIndex, position:'relative'}}
                    elevation={0}
                    className="concept-item"
                >
                    <CardContent
                        className="concept-item-content"
                        onClick={this.handleClick}
                    >
                        <img className="concept-logo-small" src={this.props.concept.logo_url}></img>
                    </CardContent>

                    <CardHeader
                        className="concept-item-header"
                        subheader={this.props.concept.name}
                        onClick={this.handleClick}
                        // style={{backgroundColor: this.props.background, background: this.props.background}}
                    />
                </Card>
            </div>
        )
    } 
}

// attach ACTION fetchAndShowConceptDetails to ConceptBasic
export default connect(null, { showConceptDetail })(ConceptMasonryButton);
