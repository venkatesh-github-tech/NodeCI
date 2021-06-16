import React from "react";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

class EditorContainer extends React.Component {
  constructor(props) {
    super(props);
    //const html = "<p>Hey this <strong>editor</strong> rocks 😀</p>";
    const contentBlock = htmlToDraft(this.props.currentContent);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      };
    }
  }

  onEditorStateChange = (editorState) => {
    // console.info(
    //   "new:",
    //   convertToRaw(this.state.editorState.getCurrentContent())
    // );
    const content = editorState.getCurrentContent();
    const isEditorEmpty = !content.hasText();
    const currentPlainText = content.getPlainText();
    //const lengthOfEditorContent = currentPlainText.length;
    const lengthOfTrimmedContent = currentPlainText.trim().length;
    const isContainOnlySpaces = !isEditorEmpty && !lengthOfTrimmedContent;

    //console.clear();
    //console.log("editor empty => ", isEditorEmpty);
    //console.log("editor containe only spaces => ", isContainOnlySpaces);
    // console.log(
    //   "editor containe some text (not only spaces) => ",
    //   !!(!isEditorEmpty && lengthOfTrimmedContent)
    // );
    // console.log("editor length =>", lengthOfEditorContent);

    //console.info("check for empty:", editorState.getCurrentContent().hasText());
    let isContentExists = isEditorEmpty
      ? false
      : isContainOnlySpaces
      ? false
      : true;
    //console.log("isContentExists:", isContentExists);
    this.props.onRTEChange(
      isContentExists
        ? draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
        : ""
    );
    this.setState({
      editorState,
    });
  };

  convertHtmlToRaw = () => {
    return draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
  };
  render() {
    const { editorState } = this.state;
    return (
      <div className="editor" style={{ border: "1px solid" }}>
        <Editor
          editorState={editorState}
          onEditorStateChange={this.onEditorStateChange}
          toolbarClassName="toolbar-class"
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbar={{
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
          }}
        />
        <textarea disabled value={this.convertHtmlToRaw()} hidden="true" />
      </div>
    );
  }
}

export default EditorContainer;
