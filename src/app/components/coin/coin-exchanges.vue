<template>
  <div
    ref="exchange"
    v-if="!isLoad"
  >
    <table-exchanges
      v-if="options.length > 0"
      :options="options"
    />
    <p
      v-else
      class="m-0 text text--caption text-secondary text-center"
    >
      List is empty
    </p>
    <cm-pagination
      :change-item-value="changeRows"
      :current-page="currentPage"
      :value-pagination="rows"
      :go-to-page="changePage"
      label-pagination="Show rows:"
      :links="formatterPagination(currentPage, total)"
      :options-pagination="rowsOptions"
      :total="total"
    />
  </div>
  <div
    class="loader-wrapper"
    v-else
  >
    <cm-loader />
  </div>
</template>
<script>
import CmPagination from '@/components/cm-pagination.vue';
import TableExchanges from '@/components/tables/table-exchanges/table-exchanges.vue';
import CmLoader from '@/components/ui/loader/cm-loader.vue';
import { getListenerEcho, stopListenerEcho } from '../../utils/echo';
import { pagination } from '../../utils/helpers/pagination-create';
export default {
  name: 'coin-exchanges',
  components: {
    TableExchanges,
    CmLoader,
    CmPagination,
  },
  props: {
    slug: {
      type: String,
    },
  },
  data: () => ({
    isLoad: false,
    options: [],
    currentPage: 1,
    total: 1,
    rows: 10,
    links: [],
    rowsOptions: [5, 10, 20],
  }),
  methods: {
    changeRows(value) {
      this.rows = value;
      this.currentPage = 1;
      this.getExchanges();
    },
    changePage(page) {
      this.currentPage = page;
      this.getExchanges();
    },
    getExchanges() {
      this.isLoad = true;
      this.$api
        .get(`/coins/${this.slug}/top-exchanges`, {
          per_page: this.rows,
          page: this.currentPage,
        })
        .then((exchanges) => {
          this.options = exchanges.data;
          exchanges.links.pop();
          exchanges.links.shift();
          this.links = exchanges.links;
          this.total = exchanges.last_page;
        })
        .finally(() => {
          this.isLoad = false;
        });
    },
    formatterPagination(currentPage, maxPages) {
      return pagination(currentPage, maxPages);
    },
  },
  mounted() {
    this.getExchanges();
    getListenerEcho('TopExchangesUpdated', () => {
      this.getExchanges();
    });
  },
  beforeDestroy() {
    stopListenerEcho('TopExchangesUpdated');
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
