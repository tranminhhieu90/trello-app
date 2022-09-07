import React, { useState, useEffect, useRef } from "react";
import "./BoardContent.scss";
import Column from "Components/Column/Column";
import { initialData } from "actions/initialData";
import * as _ from "lodash";
import { mapOrder } from "utilities/sorts";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "utilities/smoothDnd";
import {
  Container as BootstrapContainer,
  Col,
  Row,
  Form,
} from "react-bootstrap";
import Button from "react-bootstrap/Button";
function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const newColumnInputRef = useRef(null);
  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === "board-1"
    );
    if (boardFromDB) {
      setBoard(boardFromDB);
      // sort column
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, "id"));
    }
  }, []);

  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus();
      newColumnInputRef.current.select();
    }
  }, [openNewColumnForm]);

  if (_.isEmpty(board))
    return (
      <div className="not-found" style={{ padding: 10, color: "white" }}>
        Board not found
      </div>
    );

  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns];
    let newBoard = { ...board };
    newColumns = applyDrag(columns, dropResult);
    newBoard.columnOrder = newColumns.map((column) => column.id);
    newBoard.columns = newColumns;
    setColumns(newColumns);
    setBoard(newBoard);
  };

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns];
      let currentColumns = newColumns.find((column) => column.id === columnId);
      currentColumns.cards = applyDrag(currentColumns.cards, dropResult);
      currentColumns.cardOrder = currentColumns.cards.map((i) => i.id);
      setColumns(newColumns);
    }
  };

  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm);
  };

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus();
      return;
    }
    const newColumnToAdd = {
      id: Math.random().toString(36).substring(2, 5),
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: [],
    };
    let newColumns = [...columns];
    newColumns.push(newColumnToAdd);

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((column) => column.id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
    setNewColumnTitle("");
    toggleOpenNewColumnForm();
  };
  const onNewColumnTitleChange = (e) => {
    setNewColumnTitle(e.target.value);
  };

  const onUpdateColumn = (newColumnUpdate) => {
    const columnIdToUpdate = newColumnUpdate.id;
    const newColumns = [...columns];
    const columnIndexToUpdate = newColumns.findIndex(
      (i) => i.id === columnIdToUpdate
    );
    if (newColumnUpdate._destroy) {
      newColumns.splice(columnIndexToUpdate, 1);
    } else {
      newColumns.splice(columnIndexToUpdate, 1, newColumnUpdate);
    }
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((column) => column.id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
  };
  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={(index) => columns[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: "colum-drop-preview",
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column
              column={column}
              handleOnCardDrop={onCardDrop}
              onUpdateColumn={onUpdateColumn}
            />
          </Draggable>
        ))}
      </Container>
      <BootstrapContainer className="bootstrap-container">
        {!openNewColumnForm && (
          <Row>
            <Col className="add-new-column" onClick={toggleOpenNewColumnForm}>
              <i className="fa fa-plus icon" />
              Add new column
            </Col>
          </Row>
        )}
        {openNewColumnForm && (
          <Row>
            <Col className="enter-new-column">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Enter column"
                className="input-enter-new-column"
                ref={newColumnInputRef}
                value={newColumnTitle}
                onChange={onNewColumnTitleChange}
                onKeyDown={(e) => e.key === "Enter" && addNewColumn()}
              />
              <Button variant="success" onClick={addNewColumn}>
                Add new column
              </Button>
              <span className="cancel-new-column">
                <i
                  className="fa fa-trash icon"
                  onClick={toggleOpenNewColumnForm}
                ></i>
              </span>
            </Col>
          </Row>
        )}
      </BootstrapContainer>
    </div>
  );
}

export default BoardContent;
