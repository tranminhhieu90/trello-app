import React from "react";
import "./Column.scss";
import Task from "Components/Task/Task";
function Column(props) {
  return (
    <div className="column">
      <header>BrainStorm</header>
      <ul className="task-list">
        <Task />
        <li className="task-item">Add what's you like to work on below</li>
        <li className="task-item">Add what's you like to work on below</li>
        <li className="task-item">Add what's you like to work on below</li>
        <li className="task-item">Add what's you like to work on below</li>
      </ul>
      <footer>Add another card</footer>
    </div>
  );
}

export default Column;
