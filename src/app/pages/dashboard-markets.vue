<template>
  <page-card
    ref="page"
    :isLoad="isLoad"
    class="mt-4"
    :is-close-content="!getCoinsListMarketsLength"
    text-close-content="Not Found"
  >
    <template v-slot:nav>
      <cm-input
        is-icons
        secondary
        @input="onChangeSearch"
        :value="search"
        placeholder="Search Market ..."
        class-wrapper="page-markets__input mr-2"
      >
        <icon-search />
      </cm-input>
      <div class="w-100 page-markets__group-buttons">
        <presets-markets
          :presets="presets"
          :change-preset="changeActivePreset"
          :is-active-preset-button="isActivePreset"
        />
        <cm-button
          size="sm"
          custom-class="page-markets__button-bar"
          :is-outline="isDisableClearAllFilters ? false : true"
          is-default
          :on-click="showModalFilter"
        >
          {{ isDisableClearAllFilters ? 'Change Filters' : 'Filters' }}
        </cm-button>
      </div>
    </template>
    <template v-slot:no-loaded>
      <filters-sidebar
        :title="'Filters'"
        :is-active="isFilter"
        :on-close="hideModalFilter"
      >
        <cm-select
          v-for="(filter, index) in filters"
          :key="filter.id"
          ref="cmSelect"
          :index="index"
          is-filter
          :default-value="{ name: 'All', value: null }"
          :value="filter.value"
          :label="filter.name"
          :placeholder="filter.label"
          :options="filter.options"
          :class-wrapper="'page-markets__filter'"
          :on-change="changeFilterValue"
        />
        <cm-button
          is-outline
          :variant="'danger'"
          size="sm"
          :custom-class="'page-markets__button'"
          :disabled="!isDisableClearAllFilters"
          :on-click="clearAllFilters"
        >
          <icon-close-circle />
          Clear Filters
        </cm-button>
      </filters-sidebar>
    </template>
    <table-market
      :order="order"
      :on-change-order="onChangeOrder"
      :options="getCoinsListMarkets"
      :change-page="changeTablePage"
      :page="tablePage"
    />
    <template v-slot:footer>
      <cm-pagination
        :change-item-value="changeRowsValue"
        :value-pagination="rows"
        :current-page="currentPage"
        :go-to-page="changePage"
        :label-pagination="'Rows :'"
        :links="getPagesOptions"
        :options-pagination="rowsOptions"
        :total="getAllPages"
      />
    </template>
  </page-card>
</template>

<script>
import { pagination } from '@/utils/helpers/pagination-create';
import CmPagination from '../components/cm-pagination.vue';
import IconCloseCircle from '../components/icons/icon-close-circle.vue';
import IconSearch from '../components/icons/icon-search.vue';
import TableMarket from '../components/tables/market-table/table-market.vue';
import CmButton from '../components/ui/button/cm-button.vue';
import PageCard from '../components/ui/card/page-card.vue';
import CmInput from '../components/ui/input/cm-input.vue';
import CmSelect from '../components/ui/select/cm-select.vue';
import PresetsMarkets from '../components/dashboard/presets-markets.vue';
import FiltersSidebar from '../components/dashboard/filters-sidebar.vue';
import { mapGetters } from 'vuex';
import { getListenerEcho, stopListenerEcho } from '../utils/echo';
import configs from '../../configs/configs';
import axios from 'axios';

export default {
  components: {
    PageCard,
    CmInput,
    CmButton,
    CmSelect,
    TableMarket,
    CmPagination,
    IconCloseCircle,
    IconSearch,
    PresetsMarkets,
    FiltersSidebar,
  },
  data: () => ({
    categories: [],
    selectedCategory: null,
    isLoad: false,
    isFilter: false,
    search: '',
    getSearchDebounced: null,
    tablePage: 1,
    filterApi: {
      length: 10,
      start: 0,
      filters: {},
      search: '',
      order: {
        column: 'rank',
        dir: 'asc',
      },
    },
    currentPage: 1,
    rows: 10,
    rowsOptions: [10, 20, 30, 40, 50],
    filters: [],
    presets: [
      {
        id: 0,
        name: 'None',
        isActive: true,
        value: null,
      },
      {
        id: 1,
        name: 'Day Trader Preset',
        isActive: false,
        value: {
          price: { name: 'Under $5', value: { f: 5, o: '<' }, slug: '<5' },
          percent_change_1h: {
            name: 'Less than 0%',
            value: { f: 0, o: '<' },
            slug: '<0',
          },
          volume_24h: { name: '$100К +', value: { f: 100000 }, slug: '>100k' },
        },
      },
      {
        id: 2,
        name: 'Swing Trader Preset',
        isActive: false,
        value: {
          price: { name: '$10+', value: { f: 10, o: '>' }, slug: '>10' },
          percent_change_24h: {
            name: 'Over 10%',
            value: { f: 10, o: '>' },
            slug: '>10',
          },
          volume_24h: { name: '$10М +', value: { f: 10000000 }, slug: '>10m' },
        },
      },
    ],
    order: {
      column: 'rank',
      dir: 'asc',
    },
  }),
  computed: {
    ...mapGetters(['getCoinsListMarkets', 'getCoinsListMarketsLength']),
    isActivePreset() {
      if (this.presets && this.presets.length > 0) {
        const preset = this.presets.find((preset) => preset.isActive === true);
        if (preset && preset.value) {
          return true;
        }
      }
      return false;
    },
    isDisableClearAllFilters() {
      return !!this.filters.find((filter) => {
        if (filter.value) {
          if (filter.value.name === 'All') {
            return false;
          }
          return true;
        }
        return false;
      });
    },
    getPagesOptions() {
      const totalPage = Math.ceil(
        this.$store.state.markets.allCoins / this.rows
      );
      if (totalPage < this.currentPage) {
        return pagination(totalPage, totalPage);
      }
      return pagination(this.currentPage, totalPage);
    },
    getAllPages() {
      return Math.ceil(this.$store.state.markets.allCoins / this.rows);
    },
  },
  methods: {
    async fetchCategories() {
      try {
        this.initializeFilters();

        const response = await axios.get(
          `${configs.LOCAL_API_URL}/api/coins/category`
        );
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          this.categories = response.data.data.map((category) => ({
            name: category.name,
            value: category.categoryId,
          }));
          this.initializeFilters();
        } else {
          console.error('Categories data is undefined or empty');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    initializeFilters() {
      this.filters = [
        {
          id: 0,
          label: 'Category',
          filterName: 'category',
          options: [
            { name: 'All', value: null },
            ...(this.categories && Array.isArray(this.categories)
              ? this.categories.map((category) => {
                  return {
                    name: category.name,
                    value: category.value,
                    slug: category.value.toString(),
                  };
                })
              : []),
          ],
          value: { name: 'All', value: null },
        },
        {
          id: 1,
          label: 'Price',
          filterName: 'price',
          options: [
            { name: 'All', value: null },
            { name: 'Under $1', value: { f: 1, o: '<' }, slug: '1' },
            { name: 'Under $5', value: { f: 5, o: '<' }, slug: '<5' },
            { name: '$1-$5', value: { f: 1, s: 5, o: 'between' }, slug: '1-5' },
            {
              name: '$5-$10',
              value: { f: 5, s: 10, o: 'between' },
              slug: '5-10',
            },
            {
              name: '$10-$15',
              value: { f: 10, s: 15, o: 'between' },
              slug: '10-15',
            },
            {
              name: '$15-$50',
              value: { f: 15, s: 50, o: 'between' },
              slug: '15-20',
            },
            { name: '$10+', value: { f: 10, o: '>' }, slug: '>10' },
            { name: '$100+', value: { f: 100, o: '>' }, slug: '>100' },
          ],
          value: { name: 'All', value: null },
        },
        {
          id: 2,
          label: 'Coin Rank',
          filterName: 'coin_rank',
          options: [
            { name: 'All', value: null },
            { name: 'top 5', value: { f: 5 }, slug: '5' },
            { name: 'top 10', value: { f: 10 }, slug: '10' },
            { name: 'top 25', value: { f: 25 }, slug: '25' },
            { name: 'top 50', value: { f: 50 }, slug: '50' },
            { name: 'top 100', value: { f: 100 }, slug: '100' },
          ],
          value: { name: 'All', value: null },
        },
        {
          id: 3,
          label: 'Market Cap',
          filterName: 'market_cap_usd',
          options: [
            { name: 'All', value: null },
            { name: 'Over $10k', value: { f: 10000, o: '>' }, slug: '>10k' },
            {
              name: 'Under $10М',
              value: { f: 10000000, o: '<' },
              slug: '>10m',
            },
            {
              name: '$10M-$100M',
              value: { f: 10000000, s: 1000000000, o: 'between' },
              slug: '10m-100m',
            },
            {
              name: 'Over $100M',
              value: { f: 1000000000, o: '>' },
              slug: '>100m',
            },
            {
              name: 'Over $500M',
              value: { f: 5000000000, o: '>' },
              slug: '>500m',
            },
            {
              name: 'Over $1B',
              value: { f: 10000000000, o: '>' },
              slug: '>1b',
            },
          ],
          value: { name: 'All', value: null },
        },
        {
          id: 4,
          label: '% Change 1h',
          filterName: 'percent_change_1h',
          options: [
            { name: 'All', value: null },
            { name: 'Less than 0%', value: { f: 0, o: '<' }, slug: '<0' },
            {
              name: '1% - 5%',
              value: { f: 1, s: 5, o: 'between' },
              slug: '1-5',
            },
            {
              name: '5% - 10%',
              value: { f: 5, s: 10, o: 'between' },
              slug: '5-10',
            },
            {
              name: '1% - 10%',
              value: { f: 1, s: 10, o: 'between' },
              slug: '1-10',
            },
            { name: 'Over 10%', value: { f: 10, o: '>' }, slug: '>10' },
            { name: 'Over 20%', value: { f: 20, o: '>' }, slug: '>20' },
            { name: 'Over 50%', value: { f: 50, o: '>' }, slug: '>50' },
            { name: 'Over 100%', value: { f: 100, o: '>' }, slug: '>100' },
            { name: 'Over 500%', value: { f: 500, o: '>' }, slug: '>500' },
          ],
          value: { name: 'All', value: null },
        },
        {
          id: 5,
          label: '% Change 24h',
          filterName: 'percent_change_24h',
          options: [
            { name: 'All', value: null },
            { name: 'Less than 0%', value: { f: 0, o: '<' }, slug: '<0' },
            {
              name: '1% - 5%',
              value: { f: 1, s: 5, o: 'between' },
              slug: '1-5',
            },
            {
              name: '5% - 10%',
              value: { f: 5, s: 10, o: 'between' },
              slug: '5-10',
            },
            {
              name: '1% - 10%',
              value: { f: 1, s: 10, o: 'between' },
              slug: '1-10',
            },
            { name: 'Over 10%', value: { f: 10, o: '>' }, slug: '>10' },
            { name: 'Over 20%', value: { f: 20, o: '>' }, slug: '>20' },
            { name: 'Over 50%', value: { f: 50, o: '>' }, slug: '>50' },
            { name: 'Over 100%', value: { f: 100, o: '>' }, slug: '>100' },
            { name: 'Over 500%', value: { f: 500, o: '>' }, slug: '>500' },
          ],
          value: { name: 'All', value: null },
        },
        {
          id: 6,
          label: 'Volume 24h',
          filterName: 'volume_usd_24h',
          options: [
            { name: 'All', value: null },
            { name: '$10М +', value: { f: 10000000 }, slug: '>10m' },
            { name: '$1М +', value: { f: 1000000 }, slug: '>1m' },
            { name: '$100К +', value: { f: 100000 }, slug: '>100k' },
            { name: '$10К +', value: { f: 10000 }, slug: '>10k' },
            { name: '$1К +', value: { f: 1000 }, slug: '>1k' },
          ],
          value: { name: 'All', value: null },
        },
        {
          id: 7,
          label: 'Circulating Supply',
          filterName: 'available_supply',
          options: [
            { name: 'All', value: null },
            { name: 'Under $10k', value: { f: 10000, o: '<' }, slug: '<10k' },
            { name: 'Over $10k', value: { f: 10000, o: '>' }, slug: '>10k' },
            {
              name: 'Under $10М',
              value: { f: 10000000, o: '<' },
              slug: '>10m',
            },
            {
              name: '$10M-$100M',
              value: { f: 10000000, s: 1000000000, o: 'between' },
              slug: '10m-100m',
            },
            {
              name: 'Over $100M',
              value: { f: 1000000000, o: '>' },
              slug: '>100m',
            },
            {
              name: 'Over $500M',
              value: { f: 5000000000, o: '>' },
              slug: '>500m',
            },
            {
              name: 'Over $1B',
              value: { f: 10000000000, o: '>' },
              slug: '>1b',
            },
          ],
          value: { name: 'All', value: null },
        },
      ];
    },
    changeTablePage(page) {
      this.tablePage = page;
    },
    showModalFilter() {
      this.isFilter = true;
    },
    hideModalFilter() {
      this.isFilter = false;
    },
    changeRowsValue(value) {

      if (value) {
        this.rows = value;
      } else {
        this.rows = this.rowsOptions[0];
      }
      this.filterApi.length = this.rows;
      const totalPages = Math.ceil(
        this.$store.state.markets.allCoins / this.rows
      );
      this.filterApi.start = 0;
      this.changePage(1, false);

      if (Number(this.$route.query.row) !== this.rows) {
        this.$router.replace({
          query: { ...this.$route.query, rows: this.rows },
        });
      }
      this.getCoins();
    },
    changePage(page, isLoad = true) {
      if (page !== this.currentPage) {
        this.currentPage = page;
        this.filterApi.start = this.rows * (this.currentPage - 1);
        this.$router.replace({
          query: { ...this.$route.query, page: this.currentPage },
        });
        if (isLoad) {
          this.getCoins();
        }
      }
    },
    onChangeOrder(value) {
      this.order = value;
      this.$router.replace({
        query: { ...this.$route.query, order: `${value.column}-${value.dir}` },
      });
      this.filterApi.order = value;
      this.getCoins();
    },
    onChangeSearch(value) {
      this.search = value.trim();
      this.filterApi.search = value.trim();
      if (value.trim()) {
        this.$router.replace({
          query: { ...this.$route.query, search: this.filterApi.search },
        });
      } else {
        this.$router.replace({
          query: { ...this.$route.query, search: undefined },
        });
      }
      this.changePage(1, false);
      this.getSearchDebounced();
    },
    changeActivePreset(index) {
      this.presets.map((preset) => {
        preset.isActive = false;
      });
      this.$router.replace({ query: undefined }).catch((error) => {
        if (error.name != 'NavigationDuplicated') {
          throw error;
        }
      });
      this.presets[index].isActive = true;
      const query = {};
      this.filterApi.filters = {};
      this.filters.map((filter) => {
        filter.value = { name: 'All', value: null };
        if (
          this.presets[index].value !== null &&
          this.presets[index].value[filter.filterName]
        ) {
          filter.value = this.presets[index].value[filter.filterName];
          this.filterApi.filters[filter.filterName] = filter.value.value;
          query[`${filter.filterName}`] = filter.value.slug;
        }
      });
      this.$router
        .replace({ query: { ...this.$route.query, ...query } })
        .catch((error) => {
          if (error.name != 'NavigationDuplicated') {
            throw error;
          }
        });
      this.changePage(1, false);
      this.getCoins();
      this.search = '';
      this.filterApi.search = '';
    },
    changeFilterValue(data, index) {
      this.filters[index].value = data;
      if (data.value) {
        this.filterApi.filters[this.filters[index].filterName] = data.value;
        this.$router.replace({
          query: {
            ...this.$route.query,
            [`${this.filters[index].filterName}`]: data.slug,
          },
        });
      } else {
        delete this.filterApi.filters[this.filters[index].filterName];
        this.$router.replace({
          query: {
            ...this.$route.query,
            [`${this.filters[index].filterName}`]: undefined,
          },
        });
      }
      this.presets.map((preset) => {
        preset.isActive = false;
      });
      this.presets[0].isActive = true;
      this.changePage(1, false);
      this.getCoins();
    },
    clearAllFilters() {
      this.$refs.cmSelect.forEach((select) => {
        if (select.resetValue) {
          select.resetValue();
        }
      });
      this.filterApi.filters = {};
      this.$router.replace({ query: {} }).catch((error) => {
        if (error.name != 'NavigationDuplicated') {
          throw error;
        }
      });
      this.changePage(1, false);
      this.getCoins();
      this.search = '';
      this.filterApi.search = '';
    },
    getCoins() {
      this.isLoad = true;
      this.$store
        .dispatch('getCoinsMarkets', this.filterApi)
        .then((value) => {
          document.body.scrollIntoView(true);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.isLoad = false;
        });
    },
  },
  mounted() {
    this.fetchCategories();
    if (this.$route.query.search) {
      this.search = this.$route.query.search;
      this.filterApi.search = this.search;
    }
    if (this.$route.query.page) {
      this.currentPage = Number(this.$route.query.page);
      this.filterApi.start = this.rows * (this.currentPage - 1);
    }
    if (this.$route.query.rows) {
      this.rows = Number(this.$route.query.rows);
      this.filterApi.start = this.rows * (this.currentPage - 1);
      this.filterApi.length = this.rows;
    }
    this.filters.map((filter) => {
      if (this.$route.query[filter.filterName]) {
        const option = filter.options.find(
          (option) => option.slug === this.$route.query[filter.filterName]
        );
        if (option) {
          filter.value = option;
          this.filterApi.filters[filter.filterName] = option.value;
        }
      }
    });
    if (this.$route.query.order) {
      const value = this.$route.query.order.split('-');
      this.order = { column: value[0], dir: value[1] };
      this.filterApi.order = this.order;
    }
    this.getSearchDebounced = _.debounce(this.getCoins, 300);
    this.isLoad = true;
    this.$store.dispatch('getCoinsMarkets', this.filterApi).finally(() => {
      this.isLoad = false;
    });
    getListenerEcho('CoinInfoUpdated', () => {
      this.isLoad = true;
      this.$store.dispatch('getCoinsMarkets', this.filterApi).finally(() => {
        this.isLoad = false;
      });
    });
  },
  beforeDestroy() {
    stopListenerEcho('CoinInfoUpdated');
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
