import React, { Component } from 'react';

import { connect } from 'react-redux';

// material ui
import { Paper, Card, CardContent, CardHeader } from '@material-ui/core';

// actions
import { fetchAndShowConceptDetails } from '../actions';

class ConceptBasic extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            anchorEl: null,
            open: false,
        };

        this.handleClick = this.handleClick.bind(this);
    };

    handleClick(event) {
        const { currentTarget } = event;

        // turn-off the state (received from redux by comparing shit) if it's open...
        // if so, we'll send a turn-off signal. Otherwise, stay open!
        if (this.props.open == true) {
            this.props.fetchAndShowConceptDetails({
                anchorEl: currentTarget,
                open: false,
                conceptId: this.props.concept.id,
                background: this.props.background
            });
        } else {
            this.props.fetchAndShowConceptDetails({
                anchorEl: currentTarget,
                open: true,
                conceptId: this.props.concept.id,
                background: this.props.background
            });
        }
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
                        subheader={this.props.concept.details.title}
                        // style={{backgroundColor: this.props.background, background: this.props.background}}
                    />
                    
                </Card>
            </div>
        )
    } 
}

function mapStateToProps (state, ownProps) {
    // let show_popper = false;

    // if (state.activeConcept != null){
    //     const { open, conceptId } = state.activeConcept;
    //     show_popper = (open == true && conceptId == ownProps.concept.id) ? true : false;
    // }

    return { 
        activeConcept: state.activeConcept,
        //open: show_popper
    };
}

// attach ACTION fetchAndShowConceptDetails to ConceptBasic
export default connect(mapStateToProps, { fetchAndShowConceptDetails })(ConceptBasic);
