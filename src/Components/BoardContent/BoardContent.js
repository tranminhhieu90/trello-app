import React, { useState, useEffect } from "react";
import "./BoardContent.scss";
import Column from "Components/Column/Column";
import { initialData } from "actions/initialData";
import * as _ from "lodash";
import { mapOrder } from "utilities/sorts";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "utilities/smoothDnd";
function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);

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
            <Column column={column} handleOnCardDrop={onCardDrop} />
          </Draggable>
        ))}
      </Container>
      <div className="add-new-column">
        <i className="fa fa-plus icon" />
        Add new column
      </div>
    </div>
  );
}

export default BoardContent;
