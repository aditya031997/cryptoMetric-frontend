<template>
  <div class="cm-chip">
    <p class="cm-chip__text">
      <slot />
    </p>
    <button
      type="button"
      class="cm-chip__button"
      @click="this.onClose()"
    >
      <icon-close-circle />
    </button>
  </div>
</template>

<script>
import iconCloseCircle from '../../icons/icon-close-circle.vue';

export default {
  name: 'cm-chip',
  props: {
    onClose: { type: Function },
  },
  components: { iconCloseCircle },
};
</script>

<style
  lang="scss"
  scoped
></style>
