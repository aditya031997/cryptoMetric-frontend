<template>
  <div
    class="filter-sidebar"
    :class="{ 'is-active': isActive }"
    @click="handlerClose"
  >
    <div
      @click.stop
      class="filter-sidebar__content"
    >
      <div class="filter-sidebar__header">
        <button-icon
          :on-click="handlerClose"
          custom-class="text-primary"
          ><icon-close
        /></button-icon>
        <p class="m-0 text text--title-3 text-primary">{{ title }}</p>
      </div>
      <div class="page-markets__filters">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { directive as onClickaway } from 'vue-clickaway';
import buttonIcon from '../ui/button/button-icon.vue';
import IconClose from '../icons/icon-close.vue';
export default {
  components: {
    buttonIcon,
    IconClose,
  },
  props: {
    title: { type: String },
    isActive: {
      type: Boolean,
      default: false,
    },
    onClose: { type: Function },
  },
  methods: {
    handlerClose() {
      this.onClose();
    },
  },
  directives: {
    onClickaway: onClickaway,
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
