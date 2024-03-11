<template>
  <sorted-table
    ref="table"
    :values="optionsTransform"
    asc-icon="<span/>"
    desc-icon="<span/>"
    class="table"
  >
    <thead>
      <tr class="table__header">
        <th
          class="text text-secondary text--caption"
          scope="col"
        ></th>
        <th
          class="text text-secondary text--caption"
          scope="col"
        >
          Name
        </th>
        <th
          class="text text-secondary text--caption"
          scope="col"
        >
          Last Price
        </th>
        <th
          class="text text-secondary text--caption d-none d-sm-block"
          scope="col"
        >
          Market Cap
        </th>
        <th
          class="text text-secondary text--caption"
          scope="col"
        >
          <cm-toggle
            :default-is-active="!isIncrement"
            :on-click="sortClick"
            changed-name="percent_change_24h"
          >
            Change
          </cm-toggle>
        </th>
      </tr>
    </thead>
    <template #body="optionsSorted">
      <tbody>
        <row-tops
          v-for="option in optionsSorted.values"
          :key="option.coin_id"
          :id="option.coin_id"
          :isIncrement="isIncrement"
          :market-cap="option.market_cap_usd"
          :name="option.name"
          :coin="option"
          :percent="option.percent_change_24h"
          :price="option.price_usd"
          :slug="option.slug"
          :symbol="option.symbol"
        />
      </tbody>
    </template>
  </sorted-table>
</template>

<script>
import { SortedTable } from 'vue-sorted-table';
import CmToggle from '../../ui/toggle/cm-toggle.vue';
import RowTops from './row-tops.vue';

export default {
  name: '',
  components: {
    SortedTable,
    CmToggle,
    RowTops,
  },
  props: {
    options: {
      type: Array,
    },
    isIncrement: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isActiveSort: false,
    };
  },
  computed: {
    optionsTransform() {
      return this.options.map((value) => {
        value.percent_change_24h = parseFloat(value.percent_change_24h);
        return value;
      });
    },
  },
  methods: {
    sortClick() {
      this.$refs.table.sortBy('percent_change_24h');
    },
  },
  mounted() {
    this.$refs.table.sortBy('percent_change_24h');
    if (this.isIncrement) {
      this.$refs.table.sortBy('percent_change_24h');
    }
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
