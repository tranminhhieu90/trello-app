import React, { useEffect, useState } from "react";
import "./Column.scss";
import Card from "Components/Card/Card";
import ConfirmModal from "Components/Common/ConfirmModal";
import { mapOrder } from "utilities/sorts";
import { Container, Draggable } from "react-smooth-dnd";
import { Dropdown, Form } from "react-bootstrap";
import { MODAL_ACTION_CONFIRM } from "utilities/constants";
function Column({ column, handleOnCardDrop, onUpdateColumn }) {
  const cards = mapOrder(column.cards, column.cardOrder, "id");
  const [showModal, setShowModal] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");

  const toggleShowModal = () => setShowModal(!showModal);
  const onCardDrop = (columnId, dropResult) => {
    handleOnCardDrop(columnId, dropResult);
  };

  useEffect(() => {
    setColumnTitle(column.title);
  }, [column.title]);

  const onModalAction = (type) => {
    toggleShowModal();
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true,
      };
      onUpdateColumn(newColumn);
    }
  };

  const selectAllInlineText = (e) => {
    e.target.focus();
    e.target.select();
  };

  const handleColumnTitleChange = (e) => {
    setColumnTitle(e.target.value);
  };

  const handleColumnTitleBlur = () => {
    const newColumn = {
      ...column,
      title: columnTitle,
    };
    onUpdateColumn(newColumn);
  };
  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          <Form.Control
            size="sm"
            type="text"
            className="trello-content-editable"
            value={columnTitle}
            onChange={handleColumnTitleChange}
            onBlur={handleColumnTitleBlur}
            spellCheck="false"
            onClick={selectAllInlineText}
            onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
            onMouseDown={(e) => e.preventDefault()}
          />
        </div>
        <div className="column-dropdown-actions">
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-basic"
              size="sm"
              className="dropdown-btn"
            ></Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>Add card...</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowModal}>
                Remove column ...
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          orientation="vertical"
          groupName="trello-columns"
          onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
          getChildPayload={(index) => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: "card-drop-preview",
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
      </div>
      <footer>
        <div className="footer-actions">
          <i className="fa fa-plus icon" />
          Add another card
        </div>
      </footer>
      <ConfirmModal
        isShow={showModal}
        onAction={onModalAction}
        title="Remove column"
        content={`Are you sure remove <strong>${column.title}</strong>?`}
      />
    </div>
  );
}

export default Column;
