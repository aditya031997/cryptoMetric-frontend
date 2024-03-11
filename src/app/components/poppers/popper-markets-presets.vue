<template>
  <div class="popper-presets">
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
</template>

<script>
import buttonRadio from '../ui/button/button-radio.vue';
export default {
  components: { buttonRadio },
  props: {
    presets: {
      type: Array,
    },
    changePresets: {
      type: Function,
    },
    onClosePopper: {
      type: Function,
    },
  },
  methods: {
    changeActivePreset(index) {
      this.changePresets(index);
      this.onClosePopper();
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
