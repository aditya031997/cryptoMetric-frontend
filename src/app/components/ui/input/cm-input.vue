<template>
  <div
    class="cm-input"
    :class="[classWrapper]"
  >
    <label
      class="cm-input__label"
      :for="id"
      >{{ label }}</label
    >
    <div class="cm-input__wrapper">
      <input
        class="cm-input__input"
        :type="type"
        :class="{ 'is-error': error && isError, 'is-icons': isIcons, 'is-secondary': secondary, 'is-disabled': disabled }"
        :id="id"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="onChange"
      />
      <template v-if="isIcons">
        <label
          :for="id"
          class="cm-input__icon cm-input__icon--left"
        >
          <slot />
        </label>
        <template v-if="value">
          <button-icon
            :customClass="'cm-input__icon cm-input__icon--right'"
            :onClick="onClear"
          >
            <slot name="icon-right" />
          </button-icon>
        </template>
      </template>
      <template v-if="$slots.append">
        <div class="cm-input__append">
          <slot name="append" />
        </div>
      </template>
    </div>
    <p
      class="cm-input__sub-text"
      :class="{ 'is-error': error && isError }"
      v-show="(error || subText) && isError"
    >
      {{ error ? error : subText }}
    </p>
  </div>
</template>

<script>
import buttonIcon from '../button/button-icon.vue';
export default {
  components: { buttonIcon },
  name: 'cm-input',
  props: {
    id: {
      type: String,
      default: 'input',
    },
    type: { type: String, default: 'text' },
    value: { type: String },
    label: { type: String },
    subText: { type: String },
    isIcons: {
      type: Boolean,
      default: false,
    },
    secondary: {
      type: Boolean,
      default: false,
    },
    classWrapper: { type: String },
    placeholder: { type: String },
    error: { type: String },
    disabled: {
      type: Boolean,
      default: false,
    },
    isError: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onClear() {
      this.$emit('input', '');
    },
    onChange(event) {
      this.$emit('input', event.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.cm-input__wrapper {
  position: relative;
}

.cm-input__append {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.password-toggle {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}
</style>

