<template>
  <a
    :class="customClass"
    rel="noopener noreferrer"
    target="_blank"
    :href="href"
  >
    <slot />
  </a>
</template>

<script>
export default {
  name: 'external-link',
  props: {
    customClass: { type: String },
    href: {
      type: [String],
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
