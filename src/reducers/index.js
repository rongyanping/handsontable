import { combineReducers } from "redux";
import counterReducer from "./counter";
import todosReducer from "./todo";

const reducers = combineReducers({
  counter: counterReducer,
  todos: todosReducer
});

export default reducers;
