import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Masonry from "react-responsive-masonry"

import ConceptBasic from '../components/concept_basic';

class ConceptsMasonry extends Component {
    constructor (props) {
        super(props);

        // this.state = { term: '' };
    }

    renderConcepts(){
        return _.map(this.props.concepts, (concept) => {
            return (
                <div 
                    key={concept.id} 
                    className="concept-masonry-item">
                    
                    <ConceptBasic
                        concept={concept}
                    />
                </div>
            )
        });
    }

    render() {
        return (
            <Masonry className="concept-masonry">
                {this.renderConcepts()}
            </Masonry>
        );
    }
}

export default ConceptsMasonry;