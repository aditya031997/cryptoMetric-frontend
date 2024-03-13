<template>
  <div class="switch-wrapper">
    <label
      :for="id"
      class="m-0"
    >
      <slot name="label" />
    </label>
    <label
      :for="id"
      class="cm-switch"
      :class="[customClass, { 'is-icons': isIcons, 'is-visible': isVisible, 'is-active': value }]"
    >
      <input
        :id="id"
        class="cm-switch__checkbox"
        type="checkbox"
        :checked="value"
        @change="onChange"
      />
      <div class="cm-switch__content">
        <slot />
      </div>
    </label>
  </div>
</template>

<script>
export default {
  name: 'cm-switch',
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
    isIcons: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      default: false,
    },
    customClass: { type: String },
    index: { type: Number },
  },
  methods: {
    onChange(event) {
      this.$emit('input', event.target.checked, this.index);
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
