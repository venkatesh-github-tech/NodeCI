import React from "react";
import M from "materialize-css";

class Modal extends React.Component {
  componentDidMount() {
    const options = {
      onOpenStart: () => {
        console.log("Open start");
      },
      onOpenEnd: () => {
        console.log("Open End");
      },
      onCloseStart: () => {
        console.log("Close Start");
      },
      onCloseEnd: () => {
        console.log("Close End");
      },
      inDuration: 250,
      outDuration: 250,
      opacity: 0.5,
      dismissable: false,
      startingTop: "20%",
      endingTop: "30%",
    };
    console.log(this.Modal);
    M.Modal.init(this.Modal, options);
  }
  deleteBlog = (event) => {
    console.log("delete request from Modal", event);
    this.props.onDeleteBlog();
  };
  render() {
    const { header, message } = this.props;
    return (
      <div
        ref={(Modal) => {
          this.Modal = Modal;
        }}
        id="modal1"
        className="modal"
      >
        <div className="modal-content">
          <h4>{header}</h4>
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-ref btn-flat"
            onClick={this.deleteBlog}
          >
            Yes
          </button>
          <a className="modal-close waves-effect waves-green btn-flat">No</a>
        </div>
      </div>
    );
  }
}

export default Modal;
