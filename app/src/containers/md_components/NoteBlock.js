import React, { Component } from "react";

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Modal,
  MenuItem,
  Typography,
  TextField
} from "@material-ui/core";
import { Button, Paper } from "@material-ui/core";

import Editor from "draft-js-plugins-editor";
import createMarkdownShortcutsPlugin from "draft-js-markdown-shortcuts-plugin";
import { EditorState, ContentState, convertToRaw } from "draft-js";

import { stateFromMarkdown } from "draft-js-import-markdown";

// import "./NoteBlock.css";

const plugins = [
  // createMarkdownShortcutsPlugin()
];

export default class NoteBlock extends Component {
  constructor(props) {
    super(props);

    console.log("PROPS NOTEBLOCK", props);

    this.state = {
      editorState: EditorState.createWithContent(
        ContentState.createFromText(props.source)
      )
      // stateFromMarkdown(props.source)
    };

    this.handleAddAir = this.handleAddAir.bind(this);
  }

  onChange = editorState => {
    this.setState({
      editorState
    });

    console.log(
      "current state policy",
      editorState.getCurrentContent().getPlainText("\u0001")
    );

    if (this.props.notify_change) {
      this.props.notify_change(
        editorState.getCurrentContent().getPlainText("\u0001")
      );
    }
  };

  handleAddAir() {
    console.log(this.props.note);
  }

  // # test new branch information

  render() {
    return (
      <Paper className="noteblock" elevation={0}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
        />
        {/* <Button onClick={this.handleAddAir} className="note-action-button-right">/</Button> */}
      </Paper>
    );
  }
}
