import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Card, CardHeader, CardContent, CardActions, Modal, MenuItem, Typography, TextField } from '@material-ui/core';
import { Button, Paper } from '@material-ui/core';

import Editor from 'draft-js-plugins-editor';
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
import { EditorState, ContentState } from 'draft-js';

import {stateFromMarkdown} from 'draft-js-import-markdown';

const plugins = [
    createMarkdownShortcutsPlugin()
];

export default class NoteBlock extends Component {
    constructor(props) {
        super(props);

        console.log(props);

        //let contentState = stateFromMarkdown(markdown);

        this.state = {
            editorState: EditorState.createWithContent(stateFromMarkdown(props.text))
        };
    }

    onChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    render(){
        return (
            // <div key={this.props.key} data-grid={this.props.dataGrid}>
                <Paper className="noteditor-paper">
                    {/* <Typography classname="notetaker-header" gutterBottom variant="title" component="h1" align="center">
                        
                    </Typography> */}

                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        plugins={plugins}
                    />

                    <Button onClick={this.handleAddBlock} className="note-action-button-right">/</Button>

                </Paper>
            // </div>
        );
    }
}