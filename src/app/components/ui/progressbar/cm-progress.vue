<template>
  <progress
    class="cm-progress"
    :max="max"
    :value="value"
  />
</template>

<script>
export default {
  name: 'cm-progress',
  props: {
    id: {
      type: String,
      default: 'progress',
    },
    max: { type: Number },
    value: { type: Number },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
