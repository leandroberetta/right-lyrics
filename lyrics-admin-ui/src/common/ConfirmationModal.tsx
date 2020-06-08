import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "./Button";

interface ConfirmationModalProps {
  show: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export class ConfirmationModal extends React.Component<ConfirmationModalProps> {
  render() {
    const { show, onCancel, onSubmit } = this.props;
    return (
      <Modal className="confirmation__modal" show={show}>
        <Modal.Header>
          <Modal.Title>You have unsaved changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want discard them?</Modal.Body>
        <Modal.Footer>
          <Button icon="check" className="btn-primary" onClick={onSubmit}>
            Yes, discard them
          </Button>
          <Button icon="times" className="btn-danger" onClick={onCancel}>
            No wait!
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
