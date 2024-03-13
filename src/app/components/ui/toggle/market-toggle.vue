<template>
  <div class="cm-toggle">
    <p
      class="cm-toggle__text cm-toggle__text--button"
      :class="[textClass]"
      @click="onClickToggle"
    >
      <slot />
    </p>
    <div class="cm-toggle__buttons">
      <button
        type="button"
        class="cm-toggle__button"
        :class="{ 'is-active': isActive }"
        :disabled="isActive"
        @click="onClickTop"
      >
        <toggle-top />
      </button>
      <button
        type="button"
        class="cm-toggle__button"
        :class="{ 'is-active': !isActive && isActive !== null }"
        :disabled="!isActive && isActive !== null"
        @click="onClickBottom"
      >
        <toggle-bottom />
      </button>
    </div>
  </div>
</template>

<script>
import ToggleBottom from '../../icons/icon-toggle-bottom.vue';
import toggleTop from '../../icons/icon-toggle-top.vue';

const checkedOrder = (order, changedName) => {
  if (order.column === changedName) {
    if (order.dir === 'asc') {
      return true;
    } else {
      return false;
    }
  }
  return null;
};

export default {
  components: { toggleTop, ToggleBottom },
  props: {
    changedName: { type: String },
    onClick: {
      type: Function,
    },
    textClass: { type: String },
    order: {
      type: Object,
    },
  },
  computed: {
    isActive() {
      return checkedOrder(this.order, this.changedName);
    },
  },
  methods: {
    onClickToggle() {
      const isOrder = checkedOrder(this.order, this.changedName);
      if (isOrder === null || isOrder) {
        this.onClick(this.changedName, 'asc');
      } else {
        this.onClick(this.changedName, 'desc');
      }
    },
    onClickBottom() {
      this.onClick(this.changedName, 'desc');
    },
    onClickTop() {
      this.onClick(this.changedName, 'asc');
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
