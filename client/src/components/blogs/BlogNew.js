// BlogNew shows BlogForm and BlogFormReview
import React, { Component } from "react";
import BlogForm from "./BlogForm";
import BlogFormReview from "./BlogFormReview";

class BlogNew extends Component {
  state = { showFormReview: false, title: "", content: "" };

  renderContent() {
    if (this.state.showFormReview) {
      return (
        <BlogFormReview
          onCancel={() => this.setState({ showFormReview: false })}
          title={this.state.title}
          content={this.state.content}
        />
      );
    }

    return (
      <BlogForm
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
