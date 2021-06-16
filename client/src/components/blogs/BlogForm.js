// BlogForm shows a form for a user to add input
import React, { Component } from "react";
import { Link } from "react-router-dom";
import EditorContainer from "../EditorContainer";

class BlogFormNew extends Component {
  state = {
    title: "",
    blogContent: "",
    errors: { title: "", content: "" },
    editorTouched: false,
  };
  renderFields() {
    return (
      <div>
        <label htmlFor="title">Blog Title *</label>
        <input
          name="title"
          type="text"
          value={this.state.title}
          onChange={this.onTextChange.bind(this)}
        />
        {this.state.errors.title.length > 0 && (
          <span className="red-text" id="errTitle">
            {this.state.errors.title}
          </span>
        )}
        <br />
        <label htmlFor="content">Blog Content *</label>
        <br />
        <br />
        <EditorContainer
          onRTEChange={this.getEditorContent}
          currentContent={""}
        />
        {this.state.errors.content.length > 0 && (
          <span className="red-text" id="errContent">
            {this.state.errors.content}
          </span>
        )}
      </div>
    );
  }
  onTextChange(event) {
    this.setState({
      title: event.target.value,
    });
  }
  getEditorContent = (content) => {
    //console.log(content);
    this.setState({
      blogContent: content,
      editorTouched: true,
    });
  };
  onSubmitBlog(event) {
    event.preventDefault();
    //validation
    let errorsState = this.state.errors;
    let blogContent = this.state.blogContent.trim();
    let blogTitle = this.state.title.trim();
    //console.log(blogTitle, blogContent);
    errorsState.title =
      blogTitle === "" ? "Blog title should not be empty" : "";
    // Validation for blog content
    errorsState.content =
      blogContent.trim() === "" ? "Blog content should not be empty" : "";

    this.setState((prevState) => {
      let errors = Object.assign({}, prevState.errors);
      errors.content = errorsState.content;
      errors.title = errorsState.title;
      return { errors };
    });

    if (this.validateForm(this.state.errors)) {
      //console.info("this.state.blogContent", this.state.blogContent);
      //console.info("Valid form");
      this.props.onBlogSubmit(this.state.title, this.state.blogContent);
    }
    // else {
    //   console.info("Blog content should not be empty!");
    // }
  }

  validateForm = (errors) => {
    //console.info("Error:", errors);
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmitBlog.bind(this)}>
          {this.renderFields()}
          <br />
          <Link to="/blogs" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

export default BlogFormNew;
