<template>
  <aside
    id="popper-content"
    class="overflow-hidden"
  >
    <p
      ref="anchorEl"
      class="popper-tooltip__trigger"
      :class="[customClass, { 'is-disabled': disabled }]"
      @mouseenter="openPopper"
      @mouseleave="closePopper"
    >
      <slot />
    </p>
    <div id="app">
      <Popper
        ref="popper"
        role="tooltip"
        :placement="placement"
        :modifiers="{
          applyStyles: 'popper-tooltip',
        }"
        :is-open="show"
        :anchor-el="$refs.anchorEl"
      >
        <aside
          class="popper-tooltip"
          :class="{ 'is-active': show, 'is-disabled': disabled }"
          id="popper-content"
        >
          <slot name="popper" />
        </aside>
      </Popper>
    </div>
  </aside>
</template>

<script>
import { Popper } from 'popper-vue';
export default {
  name: 'popper-tooltip',
  components: {
    Popper,
  },
  props: {
    customClass: { type: String },
    placement: { type: String, default: 'right' },
    disabled: { type: Boolean, default: false },
  },
  data: () => ({ show: false }),
  methods: {
    openPopper() {
      this.show = true;
    },
    closePopper() {
      this.show = false;
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
