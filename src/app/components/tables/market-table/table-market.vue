<template>
  <responsive-table
    :titles="titles"
    :options="options"
    :responsive="responsive"
    :default-options="defaultOptionsRow"
    :page="page"
    :changePage="onChangePage"
  >
    <template #default="titles">
      <th
        v-for="title in defaultTittles"
        :key="title.id"
        class="text text-secondary text--caption"
      >
        <market-toggle
          :on-click="sortClick"
          is-radio
          :changed-name="title.sortedName"
          :order="order"
        >
          {{ title.name }}
        </market-toggle>
      </th>
      <th
        v-for="title in titles"
        :key="title.id"
        class="text text-secondary text--caption"
        scope="col"
      >
        <market-toggle
          :on-click="sortClick"
          is-radio
          :changed-name="title.sortedName"
          :order="order"
        >
          {{ title.name }}
        </market-toggle>
      </th>
    </template>
    <template #row="{ row, index }">
      <row-market
        :name="row.name"
        :coin="options[index]"
        :row="row"
        :symbol="row.symbol"
        :slug="row.slug"
        :rank="row.rank"
        :price="row.price_usd"
        :marketCap="row.market_cap_usd"
        :available-supply="row.available_supply"
        :total-supply="row.total_supply"
        :percent1h="row.percent_change_1h"
        :percent24h="row.percent_change_24h"
        :volume="row.volume_usd_24h"
      />
    </template>
  </responsive-table>
</template>

<script>
import MarketToggle from '../../ui/toggle/market-toggle.vue';
import responsiveTable from '../responsive-table.vue';
import RowMarket from './row-market.vue';
export default {
  components: {
    responsiveTable,
    RowMarket,
    MarketToggle,
  },
  props: {
    options: { type: Array },
    order: {
      type: Object,
    },
    onChangeOrder: {
      type: Function,
    },
    changePage: {
      type: Function,
    },
    page: {
      type: Number,
    },
  },
  data: () => ({
    responsive: [
      {
        max: 1900,
        min: 1700,
        elements: 7,
        pages: 1,
      },
      {
        max: 1700,
        min: 1600,
        elements: 5,
        pages: 2,
      },
      {
        max: 1600,
        min: 1415,
        elements: 4,
        pages: 2,
      },
      {
        max: 1415,
        min: 1150,
        elements: 3,
        pages: 3,
      },
      {
        max: 1150,
        min: 520,
        elements: 2,
        pages: 4,
      },
      {
        max: 520,
        min: 0,
        elements: 1,
        pages: 7,
      },
    ],
    defaultOptionsRow: ['coin_id', 'name', 'symbol', 'slug', 'rank'],
    defaultTittles: [
      { id: 0, name: 'Rank', sortedName: 'rank', isActiveSort: false },
      { id: 1, name: 'Name', sortedName: 'name', isActiveSort: false },
    ],
    titles: [
      { id: 2, name: 'Last Price', sortedName: 'price_usd', isActiveSort: false },
      { id: 3, name: 'Market Cap', sortedName: 'market_cap_usd', isActiveSort: false },
      { id: 4, name: 'Available Supply', sortedName: 'available_supply', isActiveSort: false },
      { id: 5, name: 'Total Supply', sortedName: 'total_supply', isActiveSort: false },
      { id: 6, name: '% Change 1h', sortedName: 'percent_change_1h', isActiveSort: false },
      { id: 7, name: '% Change 24h', sortedName: 'percent_change_24h', isActiveSort: false },
      { id: 8, name: 'Volume 24h', sortedName: 'volume_usd_24h', isActiveSort: false },
    ],
  }),
  methods: {
    sortClick(column, dir) {
      this.onChangeOrder({
        column,
        dir,
      });
    },
    onClickPreviousPage() {
      this.activePage = this.activePage - 1;
    },
    onClickNextPage() {
      this.activePage = this.activePage + 1;
    },
    onChangePage(page) {
      this.changePage(page);
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
