import COUNTER from "./constants";

const CounterIncrementAction = () => {
  return { type: COUNTER.INCREMENT };
};

const CounterDecrementAction = () => {
  return { type: COUNTER.DECREMENT };
};

const DishNumberIncrease = () => {
  return { type: COUNTER.DISH };
};

const CounterChangeValueAction = value => {
  return { type: COUNTER.CHANGEVALUE, payload: { value } };
};

export {
  CounterIncrementAction,
  CounterDecrementAction,
  CounterChangeValueAction,
  DishNumberIncrease
};
