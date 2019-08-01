import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Card, CardHeader, CardContent, CardActions, Modal, MenuItem, Typography } from '@material-ui/core';
import { Button, Paper } from '@material-ui/core';

import { hideNotetaker } from '../../actions/notetaker'

import GridLayout from 'react-grid-layout';

import NoteBlock from './note_block';

import _ from 'lodash';

import uuidv1 from  'uuid/v1';

const start_note = {
    1: {
        1: {id:"test"}
    }
};

const start_note_b = {
    1: {
        id: "1",
        content: "# Big realistic title\nwojew wojew wojew wojew and die weet niet eens waarom dat een ding was om over zorgen te maken"
    },
    2: {
        id: "2",
        content: "Simple boring yet effective text"
    },
    3: {
        id: "3",
        content: "why not go where there is fire and always something to ponder and try to consider"
    },
};

class FormNoteTaker extends Component{

    constructor(props) {
        super(props);

        this.state = { 
            open: false,
            notes: start_note_b,
            static: true
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleAddBlock = this.handleAddBlock.bind(this);

        this.drawNotes = this.drawNotes.bind(this);
    }

    handleClose() {
        this.props.hideNotetaker();
    }

    handleAddBlock() {
        console.log("adding block");

        let new_id = uuidv1();

        this.setState({ 
            notes: {
                ...this.state.notes,
                [new_id]: {id: new_id, content: "new block"}
            }
        });
    }

    drawNotes() {
        // console.log(this.state.notes);
        return _.map(this.state.notes, (note, keyrow) => {
            console.log(keyrow);

            return (

                <div className="noteblock-container" key={`note-${note.id}`}>
                    <NoteBlock text={note.content} />
                </div>

            // <div className="noteblock-row-container" key={`noterow-${notesinrow.id}`}>
            //     {
            //         <div className="noteblock-container" key={`note-${note.id}`}>
            //             <NoteBlock/>
            //         </div>

            //         // _.map(notesinrow, (note, key) => {
            //         //     console.log(note);
            //         //     return (
            //         //         <div className="noteblock-container" key={`note-${note.id}`}>
            //         //             <NoteBlock/>
            //         //         </div>
            //         //     );
            //         // })
            //     }
            //     <Button onClick={this.handleAddRightBlock} className="note-action-button-left">+</Button>
            // </div
            );
            
            
            // _.map(notesinrow, (note, key) => {
            //     console.log(note);
            //     return (
            //         <div className="noteblock-container" key={note.id}>
            //             <NoteBlock/>
            //             <Button onClick={this.handleAddRightBlock} className="note-action-button-left">+</Button>
            //         </div>
            //     );
            // });
        });
    }

    render() {
        return (
            <div>
                <Modal
                    className="modal-background"
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"

                    // Both props and state need to be "open" to show the form
                    open={this.props.open}
                    onClose={this.handleClose}
                >
                    
                    <div className="noteditor_main_div">

                        <div className="note-padding-for-space-above" style={{'height':'30%'}}/>
                        {this.drawNotes()}
                        <Button onClick={this.handleAddBlock} className="note-action-button-bottom">+</Button>
                        <div className="note-padding-for-space-above" style={{'height':'30%'}}/>
                        
                    </div>

                    
                </Modal>
            </div>
        );
    }

}

function mapStateToProps(state) {
    if (state.notetaker){
        console.log(state);
        return {
            open: state.notetaker.open
        };
    }
    return {};
}

export default connect( mapStateToProps, { hideNotetaker })(FormNoteTaker);