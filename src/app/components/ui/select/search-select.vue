<template>
  <div
    class="cm-select"
    :class="[classWrapper]"
  >
    <label
      v-if="label"
      class="cm-select__label"
      >{{ label }}</label
    >
    <div
      class="cm-select__select"
      :class="{
        'is-search': true,
        'is-icons': isIcons,
        'is-big': isBigSelect,
        'is-primary': isPrimary,
        'is-full': isFull,
      }"
    >
      <span
        v-if="isIcons"
        class="cm-select__icon"
      >
        <slot />
      </span>
      <multiselect
        v-model="selected"
        :options="formattedOptions"
        :placeholder="placeholder"
        :show-labels="false"
        :searchable="true"
        track-by="name"
        :custom-label="customLabel"
        @input="handleInput"
        @select="handleSelect"
      >
        <template #selected-option="{ option }">
          <div class="selected-option">
            <img
              v-if="option.slug"
              :src="getImageCoin(option.slug)"
              :alt="option.name"
              class="coin-icon"
            />
            <span>{{ option.name }} {{ option.symbol }}</span>
          </div>
        </template>
        <template #option="{ option }">
          <div class="option-template">
            <img
              v-if="option.slug"
              :src="getImageCoin(option.slug)"
              :alt="option.name"
              class="coin-icon"
            />
            <span>{{ option.name }} {{ option.symbol }}</span>
          </div>
        </template>
      </multiselect>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import IconSelected from '../../icons/icon-selected.vue';
import { getImageCoin } from '@/utils/helpers/formatter-images';
import DefaultImage from '../../default-image.vue';

export default {
  name: 'cm-select',
  components: {
    Multiselect,
    IconSelected,
    DefaultImage,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    classWrapper: {
      type: String,
    },
    isFull: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: 'Select',
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    isBigSelect: {
      type: Boolean,
      default: false,
    },
    isIcons: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      required: true,
    },
    onChange: {
      type: Function,
      required: true,
    },
    value: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      selected: this.value,
    };
  },
  computed: {
    formattedOptions() {
      return this.options.map((option) => ({
        name: option.name,
        symbol: option.symbol,
        slug: option.slug,
        value: option,
      }));
    },
  },
  methods: {
    getImageCoin(slug) {
      if (slug) {
        return getImageCoin(slug);
      }
      return null;
    },
    handleSelect(selectedOption) {
      this.selected = selectedOption;
      this.onChange(selectedOption.value);
    },
    customLabel(option) {
      return `${option.name} ${option.symbol}`;
    },
  },
 
};
</script>

<style>
.coin-icon {
  width: 32px; /* Maintain the size of the icon */
  height: 32px; /* Maintain the size of the icon */
  margin-right: 10px; /* Adjust the right margin to create space between the icon and the text */
}
.selected-option,
.option-template {
  display: flex;
  align-items: center;
}
</style>