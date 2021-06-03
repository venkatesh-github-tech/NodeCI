import _ from "lodash";
import React, { Component } from "react";
import formFields from "./formFields";
import BlogField from "./BlogField";
import { reduxForm, Field, formValueSelector } from "redux-form";
import { Link } from "react-router-dom";
import * as actions from "../../actions";
import { connect } from "react-redux";
import EditorContainer from "../EditorContainer";

class BlogEdit extends Component {
  state = { file: null, id: null, blogContent: "", errors: { content: "" } };

  renderFields() {
    return (
      <div>
        <Field
          component={BlogField}
          type="text"
          label="Blog Title"
          name="title"
        />
      </div>
    );
  }
  componentDidMount() {
    this.props.initialize({
      title: this.props.location.state.title,
      content: this.props.location.state.content,
    });
    this.setState({
      id: this.props.location.state._id,
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
    errorsState.content =
      this.state.blogContent.trim() === "<p></p>"
        ? "Blog content should not be empty"
        : "";
    this.setState((prevState) => {
      let errors = Object.assign({}, prevState.errors);
      errors.content = errorsState.content;
      return { errors };
    });
    if (this.validateForm(this.state.errors)) {
      console.info("this.state.blogContent", this.state.blogContent);
      console.info("Valid form");
    } else {
      console.info("Blog content should not be empty!");
    }

    const { updateBlog, history, formValues } = this.props;
    formValues.id = this.state.id;
    formValues.content = this.state.blogContent;
    console.log("blog content:", formValues);
    updateBlog(formValues, this.state.file, history);
  }

  validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  onChange(event) {
    this.setState({ file: event.target.files[0] });
  }

  getEditorContent = (content) => {
    console.log(content);
    this.setState({
      blogContent: content,
    });
  };
  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <h5>Please confirm your entries</h5>
        {this.renderFields()}
        <label htmlFor="content">Blog Content *</label>
        <EditorContainer
          onRTEChange={this.getEditorContent}
          currentContent={this.props.location.state.content}
        />
        {this.state.errors.content.length > 0 && (
          <span className="red-text">{this.state.errors.content}</span>
        )}
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

function validate(values) {
  const errors = {};

  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = "You must provide a values";
    }
  });

  return errors;
}
function mapStateToProps(state) {
  return {
    formValues: {
      title: formValueSelector("blogForm")(state, "title"),
      //content: formValueSelector("blogForm")(state, "content"),
      //content: this.state.blogContent
    },
  };
}

export default reduxForm({
  validate,
  form: "blogForm",
  destroyOnUnmount: false,
})(connect(mapStateToProps, actions)(BlogEdit));
