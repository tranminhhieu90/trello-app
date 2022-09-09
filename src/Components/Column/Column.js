import React, { useEffect, useRef, useState } from "react";
import "./Column.scss";
import Card from "Components/Card/Card";
import ConfirmModal from "Components/Common/ConfirmModal";
import { mapOrder } from "utilities/sorts";
import { Container, Draggable } from "react-smooth-dnd";
import { Button, Dropdown, Form } from "react-bootstrap";
import { MODAL_ACTION_CONFIRM } from "utilities/constants";
import cloneDeep from "lodash/cloneDeep";
function Column({ column, handleOnCardDrop, onUpdateColumn }) {
  const cards = mapOrder(column.cards, column.cardOrder, "id");
  const [showModal, setShowModal] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");
  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const newCardTextareaRef = useRef(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm);
  };

  const toggleShowModal = () => setShowModal(!showModal);
  const onCardDrop = (columnId, dropResult) => {
    handleOnCardDrop(columnId, dropResult);
  };

  useEffect(() => {
    setColumnTitle(column.title);
  }, [column.title]);

  useEffect(() => {
    if (newCardTextareaRef && newCardTextareaRef.current) {
      newCardTextareaRef.current.focus();
      newCardTextareaRef.current.select();
    }
  }, [openNewCardForm]);

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

  const addNewCard = () => {
    if (!newCardTitle) {
      newCardTextareaRef.current.focus();
      return;
    }
    const newCardToAdd = {
      id: Math.random().toString(36).substring(2, 5),
      boardId: column.boardId,
      columnId: column.id,
      title: newCardTitle.trim(),
      cover: null,
    };
    const newColumn = cloneDeep(column);
    newColumn.cards.push(newCardToAdd);
    newColumn.cardOrder.push(newCardToAdd.id);
    onUpdateColumn(newColumn);
    toggleOpenNewCardForm();
    setNewCardTitle("");
  };

  const onNewCardTitleChange = (e) => {
    setNewCardTitle(e.target.value);
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
        {openNewCardForm && (
          <div className="add-new-card">
            <Form.Control
              size="sm"
              as="textarea"
              row="3"
              placeholder="Enter card..."
              className="text-enter-new-card"
              ref={newCardTextareaRef}
              value={newCardTitle}
              onChange={onNewCardTitleChange}
              onKeyDown={(e) => e.key === "Enter" && addNewCard()}
            />
          </div>
        )}

        <footer>
          {openNewCardForm && (
            <div className="add-new-card-actions">
              <Button variant="success" onClick={addNewCard}>
                Add card
              </Button>
              <span className="cancel-icon" onClick={toggleOpenNewCardForm}>
                <i className="fa fa-trash icon"></i>
              </span>
            </div>
          )}
          {!openNewCardForm && (
            <div className="footer-actions" onClick={toggleOpenNewCardForm}>
              <i className="fa fa-plus icon" />
              Add another card
            </div>
          )}
        </footer>
      </div>

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
