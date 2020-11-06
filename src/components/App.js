import React, { useEffect } from "react";
import { useSelector, useStore } from "react-redux";

import Counter from "./CounterTest";
import Todo from "./Todo";
import HandsonTable from './HandsonTable';

function App() {
  const count = useSelector(state => state.counter.count);
  const items = useSelector(state => state.todos.items);
  const stores = useStore();
  useEffect(() => {
    console.log(stores.getState());
  });
  return (
    <>
      <h3>Resume</h3>
      {/* <div>Count Todos: {items.length}</div> */}
      {/* <div>Count (Increment/Decrement/Change): {count}</div> */}
      <hr />
      {/* <Counter />
      <Todo /> */}
      <HandsonTable />
    </>
  );
}

export default App;
