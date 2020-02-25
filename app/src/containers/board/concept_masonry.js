import React, { Component } from 'react';
import _ from 'lodash';
import Masonry from "react-responsive-masonry"

import ConceptMasonryButton from './concept_masonry_button';

import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag } from './utils';

class ConceptMasonry extends Component {
    constructor (props) {
        super(props);

        // this.state = { term: '' };
    }

    renderConcepts(){
        const { background }  = this.props;
        const { conceptIDs, concepts } = this.props;

        return _.map(conceptIDs, (conceptID) => {
            return (
                <Draggable key={conceptID} className="concept-masonry-item">
                    <ConceptMasonryButton
                        concept={concepts[conceptID]}
                        background={background}
                        key={conceptID}
                    />
                </Draggable>
            )
        });
    }

    render() {
        return (
            <Container // drag and drop container
                groupName="concept-holders"
                dragClass="form-ghost"
                dropClass="form-ghost-drop"
                onDrop={this.onDrop}
                nonDragAreaSelector=".field"
                orientation="horizontal"
                render={(setRef) => (
                    <div className="concept-grid" ref={setRef}> 
                        {this.renderConcepts()}
                    </div>
                )}
            >
                    {/* {this.generateForm(this.state.form)} */}
                    
            </Container>
            // <Masonry className="concept-masonry">
            //     {this.renderConcepts()}
            // </Masonry>
        );
    }
}

export default ConceptMasonry;