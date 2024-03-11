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
        'is-search': isSearch,
        'is-filter': isFilter,
        'is-selected': value && isFilter,
        'is-icons': isIcons,
        'is-big': isBigSelect,
        'is-primary': isPrimary,
        'is-full': isFull,
        'is-selected--default': value && value.name === 'All' && isFilter,
      }"
    >
      <span
        v-if="isIcons"
        class="cm-select__icon"
      >
        <slot />
      </span>
      <button-icon
        custom-class="cm-select__icon-close"
        :on-click="resetValue"
        v-if="value && isFilter"
      >
        <icon-close-circle />
      </button-icon>
      <multiselect
        :value="value"
        @input="handlerChangeSelect"
        :placeholder="placeholder"
        :label="label"
        :show-labels="false"
        :options="options"
        :searchable="isSearch"
      >
        <template
          slot="singleLabel"
          slot-scope="props"
        >
          <p
            v-if="!isFilter"
            class="cm-select__label-option cm-select__label-option--label"
          >
            {{ typeof props.option === 'object' ? props.option.name : props.option }}
          </p>
          <p
            v-else
            class="cm-select__label-option cm-select__label-option--label"
          >
            {{ props.option.name !== 'All' ? props.option.name : placeholder }}
          </p>
        </template>
        <template
          slot="option"
          slot-scope="props"
        >
          <div
            class="cm-select__option"
            :class="{ 'multiselect__option--selected': props.option.name === 'All' && value && value.name === 'All' }"
          >
            <span class="cm-select__option-icon"><icon-selected /></span>
            <p
              v-if="!isFilter"
              class="cm-select__label-option"
            >
              {{ typeof props.option === 'object' ? props.option.name : props.option }}
            </p>
            <p
              v-else
              class="cm-select__label-option"
            >
              {{ props.option.name }}
            </p>
          </div>
        </template>
      </multiselect>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import IconSelected from '../../icons/icon-selected.vue';
import IconCloseCircle from '../../icons/icon-close-circle.vue';
import ButtonIcon from '../button/button-icon.vue';
import { getImageCoin } from '../../../utils/helpers/formatter-images';
export default {
  name: 'cm-select',
  components: {
    Multiselect,
    IconSelected,
    IconCloseCircle,
    ButtonIcon,
  },
  props: {
    label: { type: String, default: '' },
    classWrapper: { type: String },
    isSearch: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: [String, Number, Object],
      default: null,
    },
    isFull: {
      type: Boolean,
      default: false,
    },
    index: { type: Number },
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
    },
    onChange: {
      type: Function,
    },
    isFilter: {
      type: Boolean,
      default: false,
    },
    resetOption: {
      type: Function,
      default: null,
    },
    value: {
      type: [String, Number, Object],
      default: null,
    },
    isCoins: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    default: null,
  }),
  methods: {
    resetValue() {
      if (this.isFilter) {
        this.onChange(this.defaultValue, this.index);
      }
    },
    getImageCoin(slug) {
      if (slug) {
        return getImageCoin(slug);
      }
      return '';
    },
    handlerChangeSelect(value) {
      this.onChange(value, this.index);
    },
  },
  mounted() {
    this.default = this.value;
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
