<template>
  <div class="todo-item">
    <div class="todo-item-left">
      <label class="todo-item-input" :class="{ active: item.checked }">

        <div class="title" v-if="!isEditing">{{ item.title }}</div>
        <input v-else v-model="editedText"
          class="title"
          @keyup.enter="saveText(editedText)"
          @blur="saveText(editedText)"
        />

        <input class="todo-checkbox" type="checkbox"
        :checked="item.checked"
        @change="onCompleted(item)" />
        <span class="checkmark"></span>
      </label>
    </div>

    <div class="todo-item-right">
      <div @click="editText(item.title)"><i class="icon-pencil"></i></div>
      <div @click="deleteTodo(item)"><i class="icon-basket"></i></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'TodoItem',
  props: {
    item: {},
  },
  data() {
    return {
      isEditing: false,
      editedText: '',
    };
  },
  methods: {
    ...mapActions(['deleteTodo', 'updateTodoChecked', 'updateTodoTitle']),
    onCompleted(item) {
      const updatedItem = { id: item.id, title: item.title, checked: !item.checked };
      this.updateTodoChecked(updatedItem);
    },
    editText(value) {
      this.isEditing = true;
      this.editedText = value;
    },
    saveText(editedText) {
      this.isEditing = false;
      const updatedItem = { ...this.item, title: editedText };
      this.updateTodoTitle(updatedItem)
    },
  }
}
</script>
