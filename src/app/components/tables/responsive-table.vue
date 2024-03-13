<template>
  <div class="mt-md-2">
    <div class="d-flex align-items-center">
      <cm-progress
        class="table-nav__progress"
        :max="getAllPages"
        id="table-progress"
        :value="getActivePage"
      />
      <div class="table-nav table-nav--mobile ml-3">
        <button-icon
          :disabled="activePage === 1"
          custom-class="table-nav__arrow table-nav__arrow--left"
          :on-click="onClickPreviousPage"
        >
          <icon-arrow-horizontal />
        </button-icon>
        <ul class="m-0 ml-n2 p-0 table-nav__dots">
          <li
            class="table-nav__dot ml-2"
            v-for="dot in dots"
            :key="dot"
            :class="{ 'is-active': dot + 1 === activePage }"
          />
        </ul>
        <button-icon
          :disabled="activePage === allPages"
          custom-class="table-nav__arrow"
          :on-click="onClickNextPage"
        >
          <icon-arrow-horizontal />
        </button-icon>
      </div>
    </div>
    <sorted-table
      ref="table"
      :values="options"
      asc-icon="<span/>"
      desc-icon="<span/>"
      class="table-market"
    >
      <thead>
        <tr>
          <slot v-bind="getArrayTitles" />
          <th
            class="table-nav table-nav--desktop"
            scope="col"
            v-if="isFullHdDesktop"
          >
            <button-icon
              :disabled="activePage === 1"
              custom-class="table-nav__arrow table-nav__arrow--left"
              :on-click="onClickPreviousPage"
            >
              <icon-arrow-horizontal />
            </button-icon>
            <ul class="m-0 ml-n2 p-0 table-nav__dots">
              <li
                class="table-nav__dot ml-2"
                v-for="dot in dots"
                :key="dot"
                :class="{ 'is-active': dot + 1 === activePage }"
              />
            </ul>
            <button-icon
              :disabled="activePage === allPages"
              custom-class="table-nav__arrow"
              :on-click="onClickNextPage"
            >
              <icon-arrow-horizontal />
            </button-icon>
          </th>
        </tr>
      </thead>
      <template #body="{ values }">
        <template v-for="(value, index) in values">
          <slot
            name="row"
            v-bind="{ row: getNewRowByTitles(value, getArrayTitles), index }"
          />
        </template>
      </template>
    </sorted-table>
  </div>
</template>

<script>
import { SortedTable } from 'vue-sorted-table';
import IconArrowHorizontal from '../icons/icon-arrow-horizontal.vue';
import ButtonIcon from '../ui/button/button-icon.vue';
import CmProgress from '../ui/progressbar/cm-progress.vue';

const getDotsByPages = (pages) => {
  const dots = [];
  for (let i = 0; i < pages; i++) {
    dots.push(i);
  }
  return dots;
};
const changePagesByWidth = (responsive) => {
  let resp;
  responsive.forEach((r) => {
    if (window.matchMedia(`(min-width: ${r.min}px) and (max-width: ${r.max}px)`).matches) {
      resp = r;
    }
  });
  if (!resp) {
    if (window.matchMedia(`(min-width: ${responsive[0].max}px)`).matches) {
      return {
        pages: responsive[0].pages,
        elements: responsive[0].elements,
      };
    }
    if (window.matchMedia(`(min-width: ${responsive[responsive.length - 1].max}px)`).matches) {
      return {
        pages: responsive[responsive.length - 1].pages,
        elements: responsive[responsive.length - 1].elements,
      };
    }
  }
  return {
    pages: resp.pages,
    elements: resp.elements,
  };
};

export default {
  name: 'responsive-table',
  components: {
    SortedTable,
    IconArrowHorizontal,
    CmProgress,
    ButtonIcon,
  },
  props: {
    titles: {
      type: Array,
    },
    options: {
      type: Array,
    },
    responsive: {
      type: Array,
    },
    defaultOptions: {
      type: Array,
    },
    page: {
      type: Number,
      default: 1,
    },
    changePage: {
      type: Function,
    },
  },
  data: () => ({
    maxColumn: 5,
    allPages: 1,
    activePage: 1,
    dots: [],
  }),
  computed: {
    getArrayTitles() {
      return this.getArrayByPages(this.titles);
    },
    isFullHdDesktop() {
      return this.allPages > 1;
    },
    getActivePage() {
      return this.activePage - 1;
    },
    getAllPages() {
      return this.allPages - 1;
    },
  },
  watch: {
    responsive() {
      this.resizeHandler(this.activePage);
    },
  },
  methods: {
    getNewRowByTitles(row, titles) {
      const newObj = {};
      for (let index = 0; index < titles.length; index++) {
        for (const key in row) {
          if (Object.hasOwnProperty.call(row, titles[index].sortedName)) {
            newObj[titles[index].sortedName] = row[titles[index].sortedName];
          }
        }
      }
      this.defaultOptions.map((option) => {
        newObj[option] = row[option];
      });
      return newObj;
    },
    onClickPreviousPage() {
      this.activePage = this.activePage - 1;
      if (this.changePage) {
        this.changePage(this.activePage);
      }
    },
    getArrayByPages(array) {
      if (this.activePage === 1) {
        return array.slice(this.activePage - 1, this.activePage * this.maxColumn);
      }
      if (this.activePage * this.maxColumn > array.length) {
        return array.slice(this.maxColumn * -1);
      }
      return array.slice((this.activePage - 1) * this.maxColumn, this.activePage * this.maxColumn);
    },
    onClickNextPage() {
      this.activePage = this.activePage + 1;
      if (this.changePage) {
        this.changePage(this.activePage);
      }
    },
    resizeHandler(page = 1) {
      const options = changePagesByWidth(this.responsive);
      this.allPages = options.pages;
      this.maxColumn = options.elements;
      this.dots = getDotsByPages(this.allPages);
      this.activePage = page;
    },
  },
  beforeMount() {
    window.addEventListener('resize', () => this.resizeHandler(this.activePage));
  },
  beforeDestroy() {
    window.removeEventListener('resize', () => this.resizeHandler(this.activePage));
  },
  mounted() {
    this.$nextTick(() => {
      this.resizeHandler(this.activePage);
    });
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
