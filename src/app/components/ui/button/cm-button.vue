<template>
  <button
    :type="type"
    @click="handler"
    :disabled="disabled"
    class="btn cm-button"
    :class="[
      customClass,
      {
        [`btn-${variant}`]: variant && !isOutline,
        [`btn-outline-${variant}`]: variant && isOutline,
        'is-line': variant && isOutline,
        'is-disabled': disabled,
        'is-block': isBlock,
        [`cm-button--${size}`]: size,
        'is-default': isDefault,
      },
    ]"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'cm-button',
  props: {
    onClick: { type: Function },
    customClass: { type: String },
    isDefault: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'lg',
    },
    variant: {
      type: String,
      default: 'primary',
    },
    type: {
      type: String,
      default: 'button',
    },
    isOutline: {
      type: Boolean,
      default: false,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handler() {
      if (this.type !== 'submit') {
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
