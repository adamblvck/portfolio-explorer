import React, { Component } from 'react';
import _ from 'lodash';
import Masonry from "react-responsive-masonry"

import ConceptBasic from '../components/concept_basic';

class ConceptsMasonry extends Component {
    constructor (props) {
        super(props);

        // this.state = { term: '' };
    }

    renderConcepts(){
        const { background }  = this.props;
        const { conceptIDs, concepts } = this.props;

        return _.map(conceptIDs, (conceptID) => {
            return (
                <div 
                    key={conceptID} 
                    className="concept-masonry-item">
                    
                    <ConceptBasic
                        concept={concepts[conceptID]}
                        background={background}
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