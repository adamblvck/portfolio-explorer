import React, { Component } from 'react';

import { connect } from 'react-redux';

// material ui
import Paper from '@material-ui/core/Paper';

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
                conceptId: this.props.concept.id
            });
        } else {
            this.props.fetchAndShowConceptDetails({
                anchorEl: currentTarget,
                open: true,
                conceptId: this.props.concept.id
            });
        }
    }

    render(){
        // let zIndex = 3; // default z-index of concept
        
        // // check if current selected concept is this component, if so, change zIndex to 5 to hover above detail card
        // const { activeConcept } = this.props;
        // if (activeConcept != null){
        //     if (activeConcept.open == true && activeConcept.conceptId == this.props.concept.id) {
        //         zIndex = 5;
        //     }
        // }

        console.log(this.props.concept);

        return (
            <div>
                <Paper 
                    //style={{zIndex:zIndex, position:'relative'}}
                    elevation={1}
                    className="concept-item"
                    onClick={this.handleClick}>
                    <img className="concept-logo-small" src={this.props.concept.logo_url} />
                </Paper>
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
