<template>
  <div
    class="cm-card"
    :class="[customClass, { 'is-width': isAutoWidth }]"
    :id="id"
  >
    <div
      class="cm-card__header"
      :class="{ 'is-border': isBorder }"
      v-if="!isHeaderNone"
    >
      <h3 class="cm-card__title">{{ title }}</h3>
      <slot name="nav" />
    </div>
    <template v-if="!isLoad">
      <template v-if="!isCloseContent">
        <slot />
      </template>
      <p
        class="cm-card__list-empty"
        v-else
      >
        {{ title }} {{ textCloseContent }}
      </p>
    </template>
    <div
      v-else
      class="cm-card__loader-wrapper"
    >
      <cm-loader />
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
      default: 'list is empty',
    },
    title: {
      type: String,
      require: true,
    },
    isHeaderNone: {
      type: Boolean,
      default: false,
    },
    isBorder: {
      type: Boolean,
      default: false,
    },
    isAutoWidth: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: '',
    },
  },
  mounted() {
    if (this.$route.hash && document.getElementById(this.$route.hash.split('#')[1])) {
      document.getElementById(this.$route.hash.split('#')[1]).scrollIntoView();
    }
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
