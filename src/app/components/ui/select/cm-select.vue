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
        'is-selected': modelValue && isFilter,
        'is-icons': isIcons,
        'is-big': isBigSelect,
        'is-primary': isPrimary,
        'is-full': isFull,
        'is-selected--default':
          modelValue && modelValue.name === 'All' && isFilter,
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
        @click="resetValue"
        v-if="modelValue && isFilter"
      >
        <icon-close-circle />
      </button-icon>
      <Multiselect
        v-model="modelValue"
        :placeholder="placeholder"
        :label="label"
        :show-labels="false"
        :options="options"
        :searchable="isSearch"
        @update:modelValue="handlerChangeSelect"
        :clearOnSelect="isFilter"
      >
        <template #singleLabel="{ option }">
          <p
            v-if="!isFilter"
            class="cm-select__label-option cm-select__label-option--label"
          >
            {{ typeof option === 'object' ? option.name : option }}
          </p>
          <p
            v-else
            class="cm-select__label-option cm-select__label-option--label"
          >
            {{ option.name !== 'All' ? option.name : placeholder }}
          </p>
        </template>
        <template #option="{ option }">
          <div
            class="cm-select__option"
            :class="{
              'multiselect__option--selected':
                option.name === 'All' &&
                modelValue &&
                modelValue.name === 'All',
            }"
          >
            <span class="cm-select__option-icon"><icon-selected /></span>
            <p
              v-if="!isFilter"
              class="cm-select__label-option"
            >
              {{ typeof option === 'object' ? option.name : option }}
            </p>
            <p
              v-else
              class="cm-select__label-option"
            >
              {{ option.name }}
            </p>
          </div>
        </template>
      </Multiselect>
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
    isSearch: { type: Boolean, default: false },
    defaultValue: { type: [String, Number, Object], default: null },
    isFull: { type: Boolean, default: false },
    index: { type: Number },
    placeholder: { type: String, default: 'Select' },
    isPrimary: { type: Boolean, default: false },
    isBigSelect: { type: Boolean, default: false },
    isIcons: { type: Boolean, default: false },
    options: { type: Array },
    onChange: { type: Function },
    isFilter: { type: Boolean, default: false },
    resetOption: { type: Function, default: null },
    value: { type: [String, Number, Object], default: null },
    isCoins: { type: Boolean, default: false },
  },
  data() {
    return {
      modelValue: this.value,
    };
  },
  methods: {
    resetValue() {
      if (this.isFilter) {
        this.modelValue = { name: 'All', value: null };
        this.onChange(this.defaultValue, this.index);
        if (this.resetOption) {
          this.resetOption();
        }
      }
    },
    getImageCoin(slug) {
      if (slug) {
        return getImageCoin(slug);
      }
      return '';
    },
    handlerChangeSelect(value) {
      this.modelValue = value;
      this.onChange(value, this.index);
    },
  },
};
</script>