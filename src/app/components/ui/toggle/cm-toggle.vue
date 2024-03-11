<template>
  <button
    class="cm-toggle"
    @click="onClickToggle"
  >
    <p
      class="cm-toggle__text"
      :class="[textClass]"
    >
      <slot />
    </p>
    <div class="cm-toggle__buttons">
      <button
        type="button"
        class="cm-toggle__button"
        :class="{ 'is-active': isActiveToggle }"
        :disabled="isActiveToggle"
      >
        <toggle-top />
      </button>
      <button
        type="button"
        class="cm-toggle__button"
        :class="{ 'is-active': !isActiveToggle && isActiveToggle !== null }"
        :disabled="!isActiveToggle"
      >
        <toggle-bottom />
      </button>
    </div>
  </button>
</template>

<script>
import ToggleBottom from '../../icons/icon-toggle-bottom.vue';
import toggleTop from '../../icons/icon-toggle-top.vue';
export default {
  components: { toggleTop, ToggleBottom },
  props: {
    add: { type: Function },
    reduce: { type: Function },
    changedName: { type: String },
    isRadio: {},
    onClick: {
      type: Function,
    },
    defaultIsActive: {
      type: Boolean,
      default: null,
    },
    textClass: { type: String },
    isActive: {
      type: [Boolean, null],
      default: null,
    },
    order: {
      type: Object,
    },
  },
  data: () => ({
    isActiveToggle: null,
  }),
  computed: {},
  methods: {
    onClickToggle() {
      this.onClick(this.changedName);
      if (!this.isActiveTop) {
        this.isActiveToggle = !this.isActiveToggle;
      }
    },
  },
  mounted() {
    this.isActiveToggle = this.defaultIsActive;
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
