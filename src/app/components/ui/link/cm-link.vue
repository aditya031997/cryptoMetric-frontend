<template>
  <router-link
    class="cm-link"
    :to="to"
    @click.native="onClickLink"
    :class="[
      customClass,
      {
        'link-secondary': !isActive,
        'link-primary': isActive,
        'is-active': isActive,
      },
    ]"
  >
    <slot name="icon" />
    <p class="cm-link__text">
      <slot />
    </p>
  </router-link>
</template>

<script>
export default {
  name: 'cm-link',
  props: {
    to: { type: [String, Object] },
    isActive: { type: Boolean, default: false },
    customClass: { type: String },
    onClick: {
      type: Function,
    },
  },
  methods: {
    onClickLink() {
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
