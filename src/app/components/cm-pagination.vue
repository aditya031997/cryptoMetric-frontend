<template>
  <div
    class="cm-pagination mt-4"
    :class="{ 'is-rows': isRows }"
    v-if="links.length > 1"
  >
    <div class="d-flex align-items-center">
      <p class="m-0 mr-2 text text-grey text--caption cm-pagination__label">{{ labelPagination }}</p>
      <cm-select
        :value="valuePagination"
        :options="optionsPagination"
        is-primary
        :on-change="changeItemsShow"
      />
    </div>
    <div class="cm-pagination__pagination">
      <button-icon
        custom-class="cm-pagination__arrow cm-pagination__arrow--left"
        :disabled="currentPage === 1"
        :on-click="onClickBack"
      >
        <icon-arrow-horizontal />
      </button-icon>
      <div class="cm-pagination__button-groups">
        <button
          v-for="(link, index) in links"
          :key="index"
          @click="onClickPage(link.label)"
          class="cm-pagination__button text"
          :class="{
            'is-active': link.active,
            'is-disable': link.label === '...',
          }"
          :disabled="link.label === '...'"
        >
          {{ link.label }}
        </button>
      </div>
      <button-icon
        class="cm-pagination__arrow"
        :disabled="currentPage === total"
        :on-click="onClickNext"
      >
        <icon-arrow-horizontal />
      </button-icon>
    </div>
  </div>
</template>

<script>
import IconArrowHorizontal from './icons/icon-arrow-horizontal.vue';
import buttonIcon from './ui/button/button-icon.vue';
import CmSelect from './ui/select/cm-select.vue';
export default {
  components: {
    buttonIcon,
    IconArrowHorizontal,
    CmSelect,
  },
  name: 'cm-pagination',
  props: {
    currentPage: { type: Number },
    total: { type: Number },
    links: {
      type: Array,
    },
    goToPage: {
      type: Function,
    },
    optionsPagination: {
      type: Array,
    },
    valuePagination: {
      type: Number,
    },
    changeItemValue: {
      type: Function,
    },
    labelPagination: {
      type: String,
    },
    isRows: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClickBack() {
      this.goToPage(this.currentPage - 1);
    },
    onClickPage(page) {
      this.goToPage(page);
    },
    onClickNext() {
      this.goToPage(this.currentPage + 1);
    },
    changeItemsShow(value) {
      this.valueSelect = value;
      this.changeItemValue(value);
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
