import React from "react";

const Todo = ({ todo }) => {
  return (
    <div>
      <h3>{todo}</h3>
      <button>IMPORTANT</button>
      <button>DONE</button>
      <button>EDIT</button>
      <button>DELETE</button>
    </div>
  );
};

export default Todo;
