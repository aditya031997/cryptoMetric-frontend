<template>
  <button
    @click="$emit('on-click')"
    class="button-widget"
    :class="[customClass]"
  >
    <span class="button-widget__icon">
      <icon-add />
    </span>
    <p class="m-0 ml-2 text"><slot /></p>
  </button>
</template>

<script>
import iconAdd from '../../icons/icon-add.vue';
export default {
  components: { iconAdd },
  props: {
    customClass: {
      type: String,
    },
    onClick: {
      type: Function,
    },
  },
  methods: {
    onClickHandler() {
      this.onClick();
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
