import TODOS from "./constants";

const TodoAddAction = payload => {
  return { type: TODOS.ADD, payload };
};

export { TodoAddAction };
