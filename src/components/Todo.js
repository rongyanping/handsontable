import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { TodoAddAction } from "../reducers/todo/actions";

function Todo() {
  const items = useSelector(state => state.todos.items);
  const dispatch = useDispatch();
  const handleClickAdd = () =>
    dispatch(TodoAddAction({ name: new Date().toLocaleDateString() }));
  return (
    <>
      <div>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={handleClickAdd}>Add</button>
      </div>
    </>
  );
}

export default Todo;
