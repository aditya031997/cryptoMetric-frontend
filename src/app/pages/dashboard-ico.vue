<template>
  <page-card
    ref="page"
    custom-class="mt-4"
    :is-close-content="!getListProjectsLength"
    :is-load="isLoad"
    text-close-content="Not Found"
    is-header-no-wrap
  >
    <template v-slot:nav>
      <cm-input
        is-icons
        secondary
        @input="onChangeSearch"
        :value="search"
        placeholder="Search Project ..."
        class-wrapper="page-ico__input mr-2"
      >
        <icon-search />
      </cm-input>
      <presets-markets
        :presets="presets"
        :changePreset="changeActivePreset"
        :isActivePresetButton="isActivePreset"
      />
    </template>
    <table-ico
      :options="getListProjects"
      :is-active-ended="filterApi.filters.status === 1"
    />
    <cm-pagination
      :change-item-value="changeRowsValue"
      :current-page="currentPage"
      :value-pagination="rows"
      :go-to-page="changePage"
      label-pagination="Rows :"
      :links="getPagesOptions"
      :options-pagination="rowsOptions"
      :total="getAllPages"
    />
  </page-card>
</template>

<script>
import { mapGetters } from 'vuex';
import CmPagination from '../components/cm-pagination.vue';
import PresetsMarkets from '../components/dashboard/presets-markets.vue';
import IconSearch from '../components/icons/icon-search.vue';
import TableIco from '../components/tables/table-ico/table-ico.vue';
import PageCard from '../components/ui/card/page-card.vue';
import CmInput from '../components/ui/input/cm-input.vue';
import { getListenerEcho, stopListenerEcho } from '../utils/echo';
import { pagination } from '../utils/helpers/pagination-create';
export default {
  components: {
    PageCard,
    CmInput,
    IconSearch,
    PresetsMarkets,
    TableIco,
    CmPagination,
  },
  data: () => ({
    isLoad: false,
    search: '',
    currentPage: 1,
    filterApi: {
      length: 10,
      start: 0,
      filters: {
        status: 0,
      },
      search: '',
    },
    rows: 10,
    rowsOptions: [10, 20, 30],
    presets: [
      {
        id: 0,
        name: 'All',
        isActive: true,
        value: 0,
      },
      {
        id: 1,
        name: 'Ongoing',
        isActive: false,
        value: 2,
      },
      {
        id: 2,
        name: 'Upcoming',
        isActive: false,
        value: 3,
      },
      {
        id: 3,
        name: 'Ended',
        isActive: false,
        value: 1,
      },
    ],
    getSearchDebounced: null,
  }),
  computed: {
    ...mapGetters(['getListProjects', 'getListProjectsLength']),
    getPagesOptions() {
      const totalPage = Math.ceil(this.$store.state.calendar.allProjects / this.rows);
      if (totalPage < this.currentPage) {
        return pagination(totalPage, totalPage);
      }
      return pagination(this.currentPage, totalPage);
    },
    getAllPages() {
      return Math.ceil(this.$store.state.calendar.allProjects / this.rows);
    },
    isActivePreset() {
      const preset = this.presets.find((preset) => preset.isActive === true);
      if (preset.value) {
        return true;
      }
      return false;
    },
  },

  methods: {
    changePage(page, isLoad = true) {
      if (page !== this.currentPage) {
        this.currentPage = page;
        this.filterApi.start = this.rows * (this.currentPage - 1);
        this.$router.replace({ query: { ...this.$route.query, page: this.currentPage } });
        if (isLoad) {
          this.getProjectsIco();
        }
      }
    },
    changeRowsValue(value) {
      if (value) {
        this.rows = value;
      } else {
        this.rows = this.rowsOptions[0];
      }
      this.filterApi.length = this.rows;
      this.filterApi.start = 0;
      this.changePage(1, false);
      this.$router.replace({ query: { ...this.$route.query, rows: this.rows } });
      this.getProjectsIco();
    },
    onChangeSearch(value) {
      this.search = value.trim();
      this.filterApi.search = value.trim();
      if (value.trim()) {
        this.$router.replace({ query: { ...this.$route.query, search: this.filterApi.search } });
      } else {
        this.$router.replace({ query: { ...this.$route.query, search: undefined } });
      }
      this.getSearchDebounced();
    },
    changeActivePreset(index) {
      this.presets.map((preset) => (preset.isActive = false));
      this.presets[index].isActive = true;
      this.$router.replace({ query: { ...this.$route.query, status: this.presets[index].value } });
      this.changePage(1, false);
      this.filterApi.start = 0;
      this.filterApi.filters.status = this.presets[index].value;
      this.getProjectsIco();
    },
    getProjectsIco() {
      this.isLoad = true;
      this.$store.dispatch('getProjectsICO', this.filterApi).then((value) => {
        this.isLoad = false;
        document.body.scrollIntoView(true);
      });
    },
  },
  mounted() {
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
    if (this.$route.query.status) {
      const status = Number(this.$route.query.status);
      this.presets.map((preset) => {
        preset.isActive = false;
        if (preset.value === status) {
          preset.isActive = true;
        }
      });
      this.filterApi.filters.status = status;
    }
    this.getSearchDebounced = _.debounce(this.getProjectsIco, 300);
    this.isLoad = true;
    this.$store.dispatch('getProjectsICO', this.filterApi).then((value) => {
      this.isLoad = false;
    });
    getListenerEcho('IcosUpdated', () => {
      this.isLoad = true;
      this.$store.dispatch('getProjectsICO', this.filterApi).then((value) => {
        this.isLoad = false;
      });
    });
  },
  beforeDestroy() {
    stopListenerEcho('IcosUpdated');
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
