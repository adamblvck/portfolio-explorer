import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Card, CardHeader, CardContent, CardActions, Modal, MenuItem, Typography } from '@material-ui/core';
import { Button, Paper } from '@material-ui/core';

import { hideNotetaker } from '../../actions/notetaker'

import GridLayout from 'react-grid-layout';

import NoteBlock from './note_block';

import _ from 'lodash';

class FormNoteTaker extends Component{

    constructor(props) {
        super(props);

        this.state = { 
            open: false,
            notes: [{id: "fafa"}, {id:"wuripqjna"}],
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
        this.setState({ notes: [...this.state.notes, {}] });
    }

    drawNotes() {
        console.log(this.state.notes);
        return _.map(this.state.notes, note => {
            return (
                <div key={note.id}>
                    <NoteBlock/>
                    <Button onClick={this.handleAddRightBlock} className="note-action-button-left">+</Button>
                </div>
            );
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
                        {/* <GridLayout className="layout" cols={6} rowHeight={60} width={1200}>
                            <div key="a" data-grid={{x: 0, y: 0, w: 1, h: 2}}>a</div>
                            <div key="b" data-grid={{x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4}}>b</div>
                            <div key="c" data-grid={{x: 4, y: 0, w: 1, h: 2}}>c</div>
                            <div key="d" data-grid={{x: 0, y: 2, w: 6, h: 2, static: this.state.static}}> <NoteBlock/> </div>
                        </GridLayout> */}

                        {this.drawNotes()}


                        {/* <NoteBlock/> */}
                        <Button onClick={this.handleAddBlock} className="note-action-button">+</Button>
                        
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