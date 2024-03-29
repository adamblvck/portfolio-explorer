import React, { Component } from 'react';

import { connect } from 'react-redux';

// material ui
import { Paper, Card, CardContent, CardHeader } from '@material-ui/core';

// actions
import { showConceptDetail } from '../../actions/concept';

// dragable DND div
import { Container, Draggable } from 'react-smooth-dnd';

class ConceptMasonryButton extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    };

    handleClick() {
        // we contain the concept in our props, so just pass on the information
        this.props.showConceptDetail( { conceptID: this.props.concept.id, background: this.props.background, open: true } );
    }

    render(){
        const classN = `concept-item ${this.props.className}`;

        return (
            <Card 
                //style={{zIndex:zIndex, position:'relative'}}
                elevation={0}
                className={classN}
            >
                    <CardContent
                        className="concept-item-content"
                        onClick={this.handleClick}
                    >
                            <img className="concept-logo-small" src={this.props.concept.logo_url} style={{'pointerEvents': 'none'}}></img>
                    </CardContent>

                    <CardHeader
                        className="concept-item-header"
                        subheader={this.props.concept.name}
                        onClick={this.handleClick}
                        // style={{backgroundColor: this.props.background, background: this.props.background}}
                    />
            </Card>
        )
    } 
}

// attach ACTION fetchAndShowConceptDetails to ConceptBasic
export default connect(null, { showConceptDetail })(ConceptMasonryButton);
