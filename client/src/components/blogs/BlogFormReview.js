// BlogFormReview shows users their form inputs for review
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actions from "../../actions";

class BlogFormReviewNew extends Component {
  state = { file: null, title: "", content: "" };
  renderFields() {
    //const { formValues } = this.props;
    //console.log(this.props);

    return (
      <div>
        <h3>{this.props.title}</h3>
        <div dangerouslySetInnerHTML={{ __html: this.props.content }} />
      </div>
    );
  }

  renderButtons() {
    const { onCancel, title, content } = this.props;
    console.log(title, content);
    return (
      <div>
        <button
          className="yellow darken-3 white-text btn-flat"
          onClick={onCancel}
        >
          Back
        </button>
        <button className="green btn-flat right white-text">
          Save Blog
          <i className="material-icons right">email</i>
        </button>
      </div>
    );
  }

  onSubmit(event) {
    event.preventDefault();

    const { submitBlog, history } = this.props;
    let formValues = {
      content: this.props.content,
      title: this.props.title,
    };
    submitBlog(formValues, this.state.file, history);
  }

  onChange(event) {
    this.setState({ file: event.target.files[0] });
  }

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
        {this.renderButtons()}
      </form>
    );
  }
}

export default connect(null, actions)(withRouter(BlogFormReviewNew));
