<template>
  <button
    type="button"
    @click="handler"
    class="button-icon"
    :class="[customClass, { 'is-disabled': disabled }]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'button-icon',
  props: {
    onClick: { type: Function },
    customClass: { type: String },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handler() {
      if (this.onClick) {
        this.onClick();
      }
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
