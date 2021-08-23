import React, { useState, useEffect } from "react";
import "./BoardContent.scss";
import Column from "Components/Column/Column";
import { initialData } from "actions/initialData";
import * as _ from "lodash";
import { mapOrder } from "utilities/sorts";
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
  return (
    <div className="board-content">
      {columns.map((column) => (
        <Column key={column.id} column={column} />
      ))}
    </div>
  );
}

export default BoardContent;
