<template>
  <div class="progress-block">
    <div class="counter">{{ isСomplitedBar ? complitedCounter : notComplitedCounter }} tasks</div>
    <div class="name">{{ name }}</div>
    <b-progress 
      :value="isСomplitedBar ? complitedCounter : notComplitedCounter" 
      :max="allTodos.length"
      height="4px"
      class="progress-block-bar" 
      :class="isСomplitedBar ? 'complited' : 'not-complited'"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { BProgress } from 'bootstrap-vue'

export default {
  name: 'ProgressBar',
  props: {
    name: String,
    isСomplitedBar: Boolean,
  },
  components: { BProgress },
  computed: {
    ...mapGetters(['allTodos']),
    complitedCounter() {
      return this.allTodos.filter(todo => todo.checked).length;
    },
    notComplitedCounter() {
      return this.allTodos.filter(todo => !todo.checked).length;
    },
  },
}
</script>
