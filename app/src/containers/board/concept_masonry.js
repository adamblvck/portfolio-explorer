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

            const concept = concepts[conceptID]

            if (concept == undefined){
                console.log(conceptID);
                return (<div>{conceptID} missing</div>);
            } 

            else
            return (
                <Draggable
                    key={`${conceptID}-draggable`}
                    render={(setRef) => (
                        <div ref={setRef} key={`${conceptID}-btn`}>
                            <ConceptMasonryButton
                                className="concept-masonry-item"
                                concept={concept}
                                background={background}
                            />
                        </div>
                    )}
                />
            )
        });
    }

    render() {
        const { parent_groupId, groupId } = this.props;

        // if (this.props.isAuthenticated)
            return (
                <Container // drag and drop container
                    groupName="concept-holders"
                    dragClass="form-ghost"
                    dropClass="form-ghost-drop"
                    onDrop={dnd_results => this.props.dnd_onDropConcept(parent_groupId, groupId, dnd_results)} // perform this on drop
                    getChildPayload={index => this.props.dnd_getConcept(parent_groupId, groupId, index)} // get column index, and index of dragged item
                    nonDragAreaSelector=".field"
                    orientation="horizontal"
                    render={(setRef) => (
                        <div className="concept-grid" ref={setRef}> 
                            {this.renderConcepts()}
                        </div>
                    )}
                />
            );
        // else
        //     return (
        //         <div className="concept-grid"> 
        //             {this.renderConcepts()}
        //         </div>
        //     );
    }
}

export default ConceptMasonry;