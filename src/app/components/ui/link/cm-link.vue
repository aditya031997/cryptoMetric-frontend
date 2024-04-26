<template>
  <router-link
    class="cm-link"
    :to="to"
    @click.native="onClickLink"
    :class="[
      customClass,
      {
        'link-secondary': !computedIsActive,
        'link-primary': computedIsActive,
        'is-active': computedIsActive,
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
    isActiveProp: { type: Boolean, default: false },
    customClass: { type: String },
    onClick: { type: Function },
  },
  computed: {
    computedIsActive() {
      return this.$route.path === this.to || this.$route.path.startsWith(this.to + '/');
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

<style lang="scss" scoped>
/* Add your styles here */
</style>
