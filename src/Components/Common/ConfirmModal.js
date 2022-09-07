import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import parse from "html-react-parser";
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from "utilities/constants";
function ConfirmModal(props) {
  const { title, content, isShow, onAction } = props;

  return (
    <Modal
      show={isShow}
      onHide={() => onAction(MODAL_ACTION_CLOSE)}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className="h5">{parse(title)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{parse(content)}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => onAction(MODAL_ACTION_CLOSE)}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => onAction(MODAL_ACTION_CONFIRM)}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
