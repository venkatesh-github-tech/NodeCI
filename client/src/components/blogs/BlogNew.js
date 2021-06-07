// BlogNew shows BlogForm and BlogFormReview
import React, { Component } from "react";
import BlogFormNew from "./BlogFormNew";
import BlogFormReviewNew from "./BlogFormReviewNew";

class BlogNew extends Component {
  state = { showFormReview: false, title: "", content: "" };

  renderContent() {
    if (this.state.showFormReview) {
      return (
        <BlogFormReviewNew
          onCancel={() => this.setState({ showFormReview: false })}
          title={this.state.title}
          content={this.state.content}
        />
      );
    }

    return (
      <BlogFormNew
        onBlogSubmit={(title, blogContent) =>
          this.setState({
            showFormReview: true,
            title: title,
            content: blogContent,
          })
        }
      />
    );
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default BlogNew;
