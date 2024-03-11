<template>
  <div
    class="cm-logo"
    :class="{ 'is-small': isSmall }"
  >
    <icon-logo />
  </div>
</template>

<script>
import iconLogo from './icons/icon-logo.vue';
export default {
  name: 'cm-logo',
  components: { iconLogo },
  props: {
    isSmall: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
