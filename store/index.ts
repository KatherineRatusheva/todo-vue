import axios from 'axios';

interface Todo {
  id: string;
  title: string;
  checked: boolean;
  position: number;
}

interface State {
  inputText: string;
  todoList: Todo[];
}

export const state = () => ({
  inputText: '' as string,
  todoList: [] as Todo[],
})

export const mutations = {
  setInputText(state: State, text: string) {
    state.inputText = text;
  },
  addTodo(state: State, todo: Todo) {
    state.todoList.push(todo);
    state.inputText = '';
  },
  deleteTodo(state: State, item: Todo) {
    state.todoList = state.todoList.filter((todo: Todo) => todo.id != item.id);
  },
  updateTodoChecked(state: State, { id, checked }: { id: string; checked: boolean }) {
    const item = state.todoList.find((todo: Todo) => todo.id === id);
    if (item) {
      item.checked = checked;
    }
  },
  updateTodoTitle(state: State, { id, title }: { id: string; title: string }) {
    const item = state.todoList.find((todo: Todo) => todo.id === id);
    if (item) {
      item.title = title;
    }
  },
  updateTodoPosition(state: State, { id, position }: { id: string; position: number }) {
    const item = state.todoList.find((todo: Todo) => todo.id === id);
    if (item) {
      item.position = position;
    }
  },
  updateTodoListOrder(state: State) {
    state.todoList.sort((a: Todo, b: Todo) => a.position - b.position);
  },
  updateAllTodos(state: State, value: Todo[]) {
    state.todoList = value;
  },
}

export const actions = {
  getTodosFromServer(context: { commit: Function }) {
    return axios.get('http://localhost:3001/todos')
      .then((response) => {
        context.commit('updateAllTodos', response.data);
        context.commit('updateTodoListOrder');
      })
      .catch((error) => {
        console.error(error);
      });
  },
  addTodo(context: { commit: Function }, todo: Todo) {
    return axios.post('http://localhost:3001/todos', todo)
      .then(() => {
        context.commit('addTodo', todo);
      })
      .catch((error) => {
        console.error(error);
      });
  },
  deleteTodo(context: { commit: Function }, todo: Todo) {
    return axios.delete(`http://localhost:3001/todos/${todo.id}`)
      .then(() => {
        context.commit('deleteTodo', todo);
      })
      .catch((error) => {
        console.error(error);
      });
  },
  updateTodoChecked(context: { commit: Function }, updatedItem: Todo) {
    return axios.patch(`http://localhost:3001/todos/${updatedItem.id}`, {
      checked: updatedItem.checked,
    })
      .then((response) => {
        context.commit('updateTodoChecked', response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  },
  updateTodoTitle(context: { commit: Function }, updatedItem: Todo) {
    return axios.patch(`http://localhost:3001/todos/${updatedItem.id}`, {
      title: updatedItem.title,
    })
      .then((response) => {
        context.commit('updateTodoTitle', response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  },
  sortTodos(context: { commit: Function }, value: Boolean) {
    return axios.get(`http://localhost:3001/todos?checked=${value}`)
      .then((response) => {
        context.commit('updateAllTodos', response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  },
  updateTodoPosition(context: { commit: Function }, updatedItem: Todo) {
    return axios.patch(`http://localhost:3001/todos/${updatedItem.id}`, {
      position: updatedItem.position,
    })
      .then((response) => {
        context.commit('updateTodoPosition', response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  },
}

export const getters = {
  allTodos: (state: State) => {
    return state.todoList;
  },
  inputText: (state: State) => {
    return state.inputText;
  },
}
