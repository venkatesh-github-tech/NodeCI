import React, { Component } from "react";
import map from "lodash/map";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../../actions";

class BlogList extends Component {
  componentDidMount() {
    this.props.fetchBlogs();
  }

  renderBlogs() {
    return map(this.props.blogs, (blog) => {
      return (
        <div className="card darken-1 horizontal" key={blog._id}>
          <div className="card-stacked">
            <div className="card-content">
              <h3>{blog.title}</h3>

              <p
                dangerouslySetInnerHTML={{
                  __html:
                    blog.content.length > 500
                      ? blog.content.slice(0, 500) + "..."
                      : blog.content,
                }}
              />
            </div>
            <div className="card-action">
              <Link to={`/blogs/${blog._id}`}>Read</Link>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return <div>{this.renderBlogs()}</div>;
  }
}

function mapStateToProps({ blogs }) {
  //console.log(blogs);
  return { blogs };
}

export default connect(mapStateToProps, { fetchBlogs })(BlogList);
