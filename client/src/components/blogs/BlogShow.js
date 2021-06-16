import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";
import { Link } from "react-router-dom";
import Modal from "./Modal";

class BlogShow extends Component {
  componentDidMount() {
    this.props.fetchBlog(this.props.match.params._id);
  }

  renderImage() {
    if (this.props.blog.imageUrl) {
      return (
        <img
          src={
            "https://venkat-blog-bucket.s3-us-west-1.amazonaws.com/" +
            this.props.blog.imageUrl
          }
          alt="Blogster"
          width="100%"
          height="450"
        />
      );
    }
  }
  onDeleteBlog = () => {
    // console.log(
    //   "Delete blog from back ends",
    //   this.props.blog._id,
    //   this.props.blog.imageUrl,
    //   this.props.history
    // );
    let formValues = {
      id: this.props.blog._id,
      existingImage: this.props.blog.imageUrl,
    };
    const { deleteBlog, history } = this.props;
    //console.log(formValues, deleteBlog, history);
    deleteBlog(formValues, history);
  };
  render() {
    if (!this.props.blog) {
      return "";
    }

    const { title, content, _id, imageUrl } = this.props.blog;

    return (
      <div>
        {this.renderImage()}
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <div>
          <ul className="fixed-action-btn">
            <li>
              <Link
                to={{
                  pathname: `/blogs/edit/${_id}`,
                  state: {
                    title: title,
                    content: content,
                    _id: _id,
                    existingImage: imageUrl,
                  },
                }}
                className="btn-floating btn-large red"
              >
                <i className="material-icons">edit</i>
              </Link>
            </li>
            <li>
              <a>
                <i className="material-icons"> </i>
              </a>
            </li>
            <li>
              <a
                className="btn-floating btn-large red modal-trigger"
                data-target="modal1"
              >
                <i className="material-icons">delete</i>
              </a>
            </li>
          </ul>
        </div>

        <br />

        <Modal
          header="Delete blog post"
          message="Are you sure to delete this post?"
          onDeleteBlog={this.onDeleteBlog}
        />
      </div>
    );
  }
}

function mapStateToProps({ blogs }, ownProps) {
  return { blog: blogs[ownProps.match.params._id] };
}

export default connect(mapStateToProps, actions)(BlogShow);
