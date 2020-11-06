import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CounterIncrementAction,
  CounterDecrementAction,
  CounterChangeValueAction
} from "../reducers/counter/actions";

function Counter() {
  const [value, setValue] = useState(0);
  const count = useSelector(state => state.counter.count);
  const dispatch = useDispatch();
  const handleClickIncrement = () => dispatch(CounterIncrementAction());
  const handleClickDecrement = () => dispatch(CounterDecrementAction());
  const handleClickChangeValue = e => dispatch(CounterChangeValueAction(value));
  const handleChangeValue = e => setValue(e.target.value);
  useEffect(() => {
    setValue(count);
  }, [count]);
  return (
    <>
      <div>{count}</div>
      <div>
        <input type="text" value={value} onChange={handleChangeValue} />
        <button onClick={handleClickChangeValue}>Change Value</button>
      </div>
      <div>
        <button onClick={handleClickIncrement}>Increment</button>
        <button onClick={handleClickDecrement}>Decrement</button>
      </div>
    </>
  );
}

export default Counter;
