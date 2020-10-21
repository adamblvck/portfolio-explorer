import React, { Component } from 'react';
import _ from 'lodash';
import Masonry from "react-responsive-masonry"

import ConceptMasonryButton from './concept_masonry_button';

import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag } from './utils';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';

class ConceptMasonry extends Component {
    constructor (props) {
        super(props);

        // this.state = { term: '' };
    }

    renderConcepts(){
        const { background }  = this.props;
        const { conceptIDs, concepts, concept_layouts, groupId, dnd_enabled} = this.props;

        // read the "1" layout (1D - default line)
        const layout = concept_layouts['1'] ? concept_layouts['1'].layout[0] : [];

        console.log("rendering layout:", concept_layouts);

        if (dnd_enabled) {

            return _.map(layout, (conceptID) => {
                const concept = concepts[conceptID]
    
                if (concept == undefined){
                    console.log(conceptID);
                    return (<div style={{'fontSize':'10px'}}>{conceptID} concept missing in {groupId}</div>);
                } 
                else
                    return (
                        <Draggable className="holon-lvl-4" key={`${conceptID}-drg-btn`}>
                            <ConceptMasonryButton
                                className="concept-masonry-item slow-shake"
                                concept={concept}
                                background={background}
                            />
                        </Draggable>
                    );
            });
        } else {
            return _.map(layout, (conceptID) => {
                const concept = concepts[conceptID]
    
                console.log("Rendering this concept:", concept);

                if (concept == undefined){
                    console.log(conceptID);
                    return (<div style={{'fontSize':'10px'}}>{conceptID} concept missing in {groupId}</div>);
                } 
                else
                    return (
                        <div className="holon-lvl-4" key={`${conceptID}-btn`}>
                            <ConceptMasonryButton
                                className="concept-masonry-item"
                                concept={concept}
                                background={background}
                            />
                        </div>
                    );
            });
        }

        // return _.map(layout, (conceptID) => {
        //     const concept = concepts[conceptID]

        //     if (concept == undefined){
        //         console.log(conceptID);
        //         return (<div style={{'fontSize':'10px'}}>{conceptID} concept missing in {groupId}</div>);
        //     } 

        //     // if drag and drop enabled & authenticated
        //     else if (this.props.dnd_enabled)
        //         return (
        //             <Draggable classname="holon-lvl-4" key={`${conceptID}-btn`}>
        //                 <ConceptMasonryButton
        //                     className="concept-masonry-item"
        //                     concept={concept}
        //                     background={background}
        //                 />
        //             </Draggable>
        //         );
        //     else 
        //         return (
        //             <div classname="holon-lvl-4" key={`${conceptID}-btn`}>
        //                 <ConceptMasonryButton
        //                     className="concept-masonry-item"
        //                     concept={concept}
        //                     background={background}
        //                 />
        //             </div>
        //         );
        // });
    }

    render() {

        const {parent_groupId, groupId, dnd_enabled} = this.props;

        if (dnd_enabled)
            return (
                <Container // drag and drop container
                    groupName="concept-holders"
                    dragClass="form-ghost"
                    dropClass="form-ghost-drop"
                    onDrop={dnd_results => this.props.dnd_onDropConcept(parent_groupId, groupId, dnd_results)} // perform this on drop
                    getChildPayload={index => this.props.dnd_getConcept(parent_groupId, groupId, index)} // get column index, and index of dragged item
                    // nonDragAreaSelector=".field"
                    orientation="horizontal"
                    render={(setRef) => {
                        return (<div className="concept-grid-draggable" ref={setRef}> 
                            {this.renderConcepts()}
                        </div>);
                    }}
                />
            );
        else
            return (
                <div className="concept-grid-flexbox" style={{}}> 
                    {this.renderConcepts()}
                    {/* <Fab className="add-concept-floating-button" color="colorInherit" aria-label="add" size="small">
                        <AddIcon />
                    </Fab> */}
                </div>
            );

        // if (this.props.isAuthenticated)
        // return (
        //     <div className="concept-grid-flexbox" style={{}}> 
        //         {this.renderConcepts()}
        //         {/* <Fab className="add-concept-floating-button" color="colorInherit" aria-label="add" size="small">
        //             <AddIcon />
        //         </Fab> */}
        //     </div>

            // <Container // drag and drop container
            //     groupName="concept-holders"
            //     dragClass="form-ghost"
            //     dropClass="form-ghost-drop"
            //     onDrop={dnd_results => this.props.dnd_onDropConcept(parent_groupId, groupId, dnd_results)} // perform this on drop
            //     getChildPayload={index => this.props.dnd_getConcept(parent_groupId, groupId, index)} // get column index, and index of dragged item
            //     nonDragAreaSelector=".field"
            //     orientation="horizontal"
            //     render={(setRef) => (
            //         <div className="concept-grid-draggable" ref={setRef}> 
            //             {this.renderConcepts()}
            //         </div>
            //     )}
            // />
        // );
    }
}

export default ConceptMasonry;