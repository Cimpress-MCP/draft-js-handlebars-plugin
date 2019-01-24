
import React, { Component } from 'react';
import Editor from 'draft-js-plugins-editor';
import { EditorState, ContentState } from 'draft-js';

import createPlaceholderVisualizationPlugin from '../src/index';
import '../src/Placeholders.css';

export default class TestEditor extends Component {
  constructor(props) {
    super(props);
    const contentState = ContentState.createFromText(this.props.value);
    const editorState = EditorState.createWithContent(contentState);
    this.state = { editorState };

    this.plugins = [createPlaceholderVisualizationPlugin()];
    this.onChange = this.onChange.bind(this);
  }

  onChange(editorState) {
    this.setState({ editorState }, this.props.onChange(editorState));
  }

  render() {
    return <div style={{ margin: '60px', backgroundColor: 'white', padding: '20px' }}>
      <Editor
        spellCheck
        ref={(b) => this.editor = b}
        className='handlebarsTextBox'
        onChange={this.onChange}
        editorState={this.state.editorState}
        plugins={this.plugins}
      />
    </div>;
  }
}
