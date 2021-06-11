import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as actions from "../../actions";
import { connect } from "react-redux";
import EditorContainer from "../EditorContainer";

class BlogEdit extends Component {
  state = {
    file: null,
    id: null,
    title: "",
    blogContent: "",
    existingImage: "",
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
          <span className="red-text">{this.state.errors.title}</span>
        )}
        <br />
        <label htmlFor="content">Blog Content *</label>
        <br />
        <br />
        <EditorContainer
          onRTEChange={this.getEditorContent}
          currentContent={this.props.location.state.content}
        />
        {this.state.errors.content.length > 0 && (
          <span className="red-text">{this.state.errors.content}</span>
        )}
      </div>
    );
  }
  componentDidMount() {
    this.setState({
      id: this.props.location.state._id,
      title: this.props.location.state.title,
      existingImage: this.props.location.state.existingImage,
    });
  }
  renderButtons() {
    return (
      <div>
        <Link to={`/blogs/${this.props.location.state._id}`}>
          <button className="yellow darken-3 white-text btn-flat">Back</button>
        </Link>

        <button className="green btn-flat right white-text">
          Update Blog
          <i className="material-icons right">email</i>
        </button>
      </div>
    );
  }

  onSubmit(event) {
    event.preventDefault();
    //vaidation
    let errorsState = this.state.errors;
    let blogContent = this.state.blogContent.trim();
    let blogTitle = this.state.title.trim();
    console.log("title", blogTitle);
    //Validation for Title
    console.log("errorsState.title", errorsState.title);

    errorsState.title =
      blogTitle === "" ? "Blog title should not be empty" : "";
    // Validation for blog content
    if (blogContent === "" && !this.state.editorTouched) {
      if (this.props.location.state.content.trim() !== "") {
        //console.info("location:", this.props.location.state.content.trim());
        errorsState.content = "";
        blogContent = this.props.location.state.content.trim();
      } else {
        errorsState.content = "Blog content should not be empty";
      }
    } else {
      errorsState.content =
        this.state.blogContent.trim() === ""
          ? "Blog content should not be empty"
          : "";
    }

    this.setState((prevState) => {
      let errors = Object.assign({}, prevState.errors);
      errors.content = errorsState.content;
      errors.title = errorsState.title;
      return { errors };
    });

    //console.info("blogContent", blogContent);
    if (this.validateForm(this.state.errors)) {
      //console.info("this.state.blogContent", this.state.blogContent);
      //console.info("Valid form");
      const { updateBlog, history } = this.props;
      //console.info(this.state);
      let formValues = {
        id: this.state.id,
        content: blogContent,
        title: blogTitle,
        existingImage: this.state.existingImage,
      };
      console.log("blog content:", formValues);
      updateBlog(formValues, this.state.file, history);
    } else {
      console.info("Blog content should not be empty!");
    }
  }

  validateForm = (errors) => {
    console.info("Error:", errors);
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  onChange(event) {
    this.setState({ file: event.target.files[0] });
  }

  onTextChange(event) {
    this.setState({
      title: event.target.value,
    });
  }
  getEditorContent = (content) => {
    console.log(content);
    this.setState({
      blogContent: content,
      editorTouched: true,
    });
  };
  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <h5>Please confirm your entries</h5>
        {this.renderFields()}
        <h5>Add an Image</h5>
        <input
          onChange={this.onChange.bind(this)}
          type="file"
          accept="image/*"
        />
        <br />

        {this.renderButtons()}
      </form>
    );
  }
}

export default connect(null, actions)(BlogEdit);
