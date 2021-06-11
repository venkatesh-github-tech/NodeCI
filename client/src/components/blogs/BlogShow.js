import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchBlog } from "../../actions";
import { Link } from "react-router-dom";

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
        <div className="fixed-action-btn">
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
        </div>
      </div>
    );
  }
}

function mapStateToProps({ blogs }, ownProps) {
  return { blog: blogs[ownProps.match.params._id] };
}

export default connect(mapStateToProps, { fetchBlog })(BlogShow);
