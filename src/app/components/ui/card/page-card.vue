<template>
  <div
    class="cm-card"
    :class="[customClass]"
  >
    <div
      class="cm-card__header is-page"
      :class="{ 'is-nowrap': isHeaderNoWrap, 'is-none': isNoneHeader, 'is-border': isHeaderBorderBottom }"
    >
      <slot name="nav" />
    </div>
    <slot name="no-loaded" />
    <template v-if="!isLoad">
      <template v-if="!isCloseContent">
        <slot />
      </template>
      <p
        class="cm-card__list-empty"
        v-else
      >
        {{ textCloseContent }}
      </p>
    </template>
    <div
      v-else
      class="cm-card__loader-wrapper"
    >
      <cm-loader />
    </div>
    <div class="cm-card__footer mt-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
import cmLoader from '../loader/cm-loader.vue';

export default {
  components: { cmLoader },
  name: 'cm-card',
  props: {
    customClass: {
      type: String,
    },
    headerResponsive: {
      type: Boolean,
      default: false,
    },
    isLoad: {
      type: Boolean,
      default: false,
    },
    isCloseContent: {
      type: Boolean,
      default: false,
    },
    textCloseContent: {
      type: String,
      default: 'card is empty',
    },
    isHeaderNoWrap: {
      type: Boolean,
      default: false,
    },
    isNoneHeader: {
      type: Boolean,
      default: false,
    },
    isHeaderBorderBottom: {
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
