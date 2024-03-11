<template>
  <sorted-table
    ref="table-exc"
    :values="options"
    asc-icon="<span/>"
    desc-icon="<span/>"
    class="table"
  >
    <thead>
      <tr class="table__header">
        <th
          class="text text-secondary text--caption w-50"
          scope="col"
        >
          Market
        </th>
        <th
          class="text text-secondary text--caption w-50"
          scope="col"
        >
          Volume 24h
        </th>
      </tr>
    </thead>
    <template #body="optionsSorted">
      <tbody>
        <row-exchanges
          v-for="(option, index) in optionsSorted.values"
          :key="index"
          :name="option.exchange_market"
          :volume="option.volume_usd_24h"
          :image="option.exchange_market_image"
        />
      </tbody>
    </template>
  </sorted-table>
</template>

<script>
import { SortedTable } from 'vue-sorted-table';
import RowExchanges from './row-exchanges.vue';

export default {
  components: {
    SortedTable,
    RowExchanges,
  },
  props: {
    options: {
      type: Array,
    },
  },
  mounted() {},
};
</script>

<style
  lang="scss"
  scoped
></style>
