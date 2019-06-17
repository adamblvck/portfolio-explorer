import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Card, CardHeader, CardContent, CardActions, Modal, MenuItem, Typography, TextField } from '@material-ui/core';
import { Button, Paper } from '@material-ui/core';

import Editor from 'draft-js-plugins-editor';
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
import { EditorState } from 'draft-js';

const plugins = [
    createMarkdownShortcutsPlugin()
];

export default class NoteBlock extends Component{
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty()
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
                    
                </Paper>
            // </div>
        );
    }
}