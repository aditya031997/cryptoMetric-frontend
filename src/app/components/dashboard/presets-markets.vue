<template>
  <div class="presets-markets">
    <div class="presets-markets__presets">
      <p class="m-0 text text--caption text-secondary">Presets:</p>
      <button-radio
        v-for="(preset, index) in presets"
        :key="preset.id"
        :is-active="preset.isActive"
        custom-class="ml-1"
        @click="changeActivePreset(index)"
      >
        {{ preset.name }}
      </button-radio>
    </div>
    <button
      type="button"
      class="btn cm-button presets-markets__popper-button"
      :class="isActivePresetButton ? 'btn-primary' : 'btn-outline-primary'"
      @click="openPopper"
      ref="presetsButton"
    >
      Presets
    </button>
    <div class="presets-markets__popper">
      <Popper
        role="tooltip"
        placement="bottom-end"
        :options="{
          modifiers: { offset: { offset: '-0,10px' } },
        }"
        :has-arrow="false"
        :is-open="show"
        :anchor-el="$refs.presetsButton"
        :on-close="closePopper"
      >
        <aside
          class="presets-markets__content"
          id="popper-content"
        >
          <popper-markets-presets
            :presets="presets"
            :change-presets="changeActivePreset"
            :on-close-popper="closePopper"
          />
        </aside>
      </Popper>
    </div>
  </div>
</template>

<script>
import popperMarketsPresets from '../poppers/popper-markets-presets.vue';
import ButtonRadio from '../ui/button/button-radio.vue';
import { Popper } from 'popper-vue';
export default {
  name: 'presets-markets',
  components: {
    popperMarketsPresets,
    ButtonRadio,
    Popper,
  },
  props: {
    presets: {
      type: Array,
    },
    changePreset: {
      type: Function,
    },
    isActivePresetButton: {
      type: Boolean,
      default: false,
    },
    isPresetActive: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    show: false,
  }),
  methods: {
    openPopper() {
      this.show = !this.show;
    },
    closePopper() {
      this.show = false;
    },
    changeActivePreset(index) {
      this.changePreset(index);
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
