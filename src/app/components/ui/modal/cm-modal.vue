<template>
  <aside
    v-if="isActive"
    class="modal-wrapper"
  >
    <div
      class="modal"
      v-on-clickaway="handlerClose"
    >
      <div class="modal__header">
        <h2 class="modal__title">{{ title }}</h2>
        <button-icon
          :onClick="handlerClose"
          :customClass="'modal__button'"
        >
          <icon-close />
        </button-icon>
      </div>
      <slot />
    </div>
  </aside>
</template>

<script>
import { directive as onClickaway } from 'vue-clickaway';
import iconClose from '../../icons/icon-close.vue';
import buttonIcon from '../button/button-icon.vue';
export default {
  name: 'cm-modal',
  components: { buttonIcon, iconClose },
  props: {
    title: { type: String },
    onClose: { type: Function },
    isActive: {
      type: Boolean,
      default: false,
    },
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
