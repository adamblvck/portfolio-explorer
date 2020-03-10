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
        const { conceptIDs, concepts, concept_layouts} = this.props;

        const layout = concept_layouts['1'] ? concept_layouts['1'].layout[0] : [];
        // console.log(layout, concept_layouts);

        return _.map(layout, (conceptID) => {
            return (
                <Draggable
                    key={`${conceptID}-draggable`}
                    render={(setRef) => (
                        <div ref={setRef}>
                            <ConceptMasonryButton
                                className="concept-masonry-item"
                                concept={concepts[conceptID]}
                                background={background}
                                key={`${conceptID}-btn`}
                            />
                        </div>
                    )}
                />
            )
        });
    }

    render() {
        // console.log(this.props);

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
            />
            // <Masonry className="concept-masonry">
            //     {this.renderConcepts()}
            // </Masonry>
        );
    }
}

export default ConceptMasonry;