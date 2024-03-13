<template>
  <img
    v-if="!isError"
    :src="src"
    :alt="alt"
    @error="isError = true"
  />
  <cm-logo v-else />
</template>

<script>
import CmLogo from './cm-logo.vue';
export default {
  components: { CmLogo },
  props: {
    src: {
      type: String,
    },
    alt: {
      type: String,
    },
  },
  data: () => ({
    isError: false,
  }),
};
</script>

<style
  lang="scss"
  scoped
></style>
