<template>
  <button
    class="button-radio text text--caption-bold"
    :class="[{ 'is-active': isActive }, customClass]"
    @click="onClickHandler"
    :disabled="isActive"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'button-radio',
  props: {
    customClass: {
      type: String,
    },
    isActive: {
      type: Boolean,
    },
  },
  methods: {
    onClickHandler() {
      this.$emit('click');
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
