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
        :value="value"
        @input="handlerChangeSelect"
        :placeholder="placeholder"
        :label="'name'"
        :show-labels="false"
        :options="options"
        :searchable="true"
      >
        <template
          slot="singleLabel"
          slot-scope="props"
        >
          <div
            class="d-flex align-items-center"
            :key="props.option.slug"
          >
            <default-image
              class="cm-select__icon"
              v-if="props.option.slug"
              :src="getImageCoin(props.option.slug)"
              :alt="`${props.option.name} icon`"
            />
            <p class="m-0 ml-2">
              {{ props.option.name }}<span class="ml-1">{{ props.option.symbol }}</span>
            </p>
          </div>
        </template>
        <template
          slot="option"
          slot-scope="props"
        >
          <div
            class="cm-select__option"
            :key="props.option.slug"
          >
            <span class="cm-select__option-icon"><icon-selected /></span>
            <default-image
              class="cm-select__icon"
              v-if="props.option.slug"
              :src="getImageCoin(props.option.slug)"
              :alt="`${props.option.name} icon`"
            />
            <p class="m-0 ml-2">
              {{ props.option.name }}<span class="ml-1">{{ props.option.symbol }}</span>
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
    resetOption: {
      type: Function,
      default: null,
    },
    value: {
      type: [String, Number, Object],
      default: null,
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
    },
    handlerChangeSelect(value) {
      this.onChange(value, this.index);
    },
  },
  mounted() {
    this.default = this.value;
    console.log('Options:', this.options.slug);

  },
};
</script>

<style
  lang="scss"
  scoped
></style>
