import produce from "immer";
import TODOS from "./constants";

const initialValue = {
  items: []
};
const todosReducer = produce((draft, action) => {
  switch (action.type) {
    case TODOS.ADD:
      draft.items.push(action.payload);
      break;
    default:
      break;
  }
}, initialValue);

export default todosReducer;
