<template>
  <div class="todo-wrapper">
    <img class="todo-img" src="../assets/img/Illustration.svg" alt="todo">
    <h1 class="todo-title">Today I need to</h1>

    <div class="todo-header">
      <input type="text"
        class="todo-input"
        :value="inputText"
        placeholder="Add new todo"
        @input="addNewTodo"
        @keyup.enter="addTodoItem(inputText)">

      <button class="todo-add-btn" v-if="inputText" @click="addTodoItem(inputText)">Submit</button>
    </div>

    <draggable v-model="allTodos" class="todo-list" @end="handleDragEnd">
      <template v-for="todoItem in allTodos">
        <TodoItem :key="todoItem.id" :item="todoItem" />
      </template>
    </draggable>

    <div v-if="allTodos.length" class="todo-progress">
      <ProgressBar name="Completed" :isСomplitedBar="true" />
      <ProgressBar name="To be finished" :isСomplitedBar="false" />
    </div>

    <div v-if="allTodos.length" class="todo-navigation" :class="{ 'not-complited': isNotComplited, 'complited': isComplited }">
      <button @click="checkAllTasks(true)" v-if="isNotComplited || !isComplited">Check all</button>
      <button class="active" @click="showAllTasks">All</button>
      <button @click="sortAllTodos(false)" v-if="!isNotComplited && !isComplited">Active</button>
      <button @click="sortAllTodos(true)" v-if="!isNotComplited && !isComplited">Complited</button>
      <button @click="clearComplitedTodos(false)" v-if="isComplited || !isNotComplited">Clear complited</button>
    </div>

    <div class="todo-bottom-text" v-if="!allTodos.length">Congrat, you have no more tasks to do</div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import draggable from 'vuedraggable'
import ProgressBar from './ProgressBar.vue'
import TodoItem from './TodoItem.vue'

export default {
  name: 'TodoList',
  components: { draggable, ProgressBar, TodoItem },
  mounted() {
    this.getTodosFromServer();
  },
  computed: {
    ...mapGetters(['inputText']),
    allTodos: {
      get() {
        return this.$store.getters.allTodos;
      },
      set(value) {
        this.$store.commit('updateAllTodos', value);
      }
    },
    isNotComplited() {
      return this.allTodos.every(todo => !todo.checked);
    },
    isComplited() {
      return this.allTodos.every(todo => todo.checked);
    },
  },
  methods: {
    ...mapActions(['addTodo', 'getTodosFromServer', 'sortTodos', 'updateTodoChecked', 'deleteTodo', 'updateTodoPosition']),
    addNewTodo(e) {
      this.$store.commit('setInputText', e.target.value)
    },
    addTodoItem(text) {
      this.addTodo({
        id: uuidv4(),
        title: text,
        checked: false,
        position: this.allTodos.length,
      })
    },
    sortAllTodos(value) {
      this.sortTodos(value)
    },
    showAllTasks() {
      this.getTodosFromServer();
    },
    clearComplitedTodos() {
      const complitedTodos = this.allTodos.filter(item => item.checked === true);

      complitedTodos.forEach(element => {
        this.deleteTodo(element)
      });
    },
    checkAllTasks(value) {
      this.allTodos.map(item => {
        const task = { ...item, checked: value };
        this.updateTodoChecked(task);
      });
    },
    handleDragEnd() {
      this.allTodos.map((item, index) => {
        const task = { ...item, position: index };
        this.updateTodoPosition(task);
      });
    },
  }
}
</script>
