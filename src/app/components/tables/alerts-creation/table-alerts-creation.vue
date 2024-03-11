<template>
  <sorted-table
    ref="table-exc"
    :values="options"
    asc-icon="<span/>"
    desc-icon="<span/>"
    class="table table--alerts"
  >
    <thead>
      <tr class="table__header">
        <th
          class="text text-secondary text--caption "
          scope="col"
        >
          Name
        </th>
        <th
          class="text text-secondary text--caption"
          scope="col"
        >
          Alert Value
        </th>
        <th
          class="text text-secondary text--caption"
          scope="col"
        >
          Alert Action
        </th>
        <th
          class="text text-secondary text--caption"
          scope="col"
        >
          Action
        </th>
      </tr>
    </thead>
    <template #body="optionsSorted">
      <tbody>
        <row-alerts-creation
          v-for="option in optionsSorted.values"
          :key="option.id"
          :id="option.id"
          :slug="option.slug"
          :symbol="option.symbol"
          :price="option.price"
          :name="option.name"
          :currency="option.price_currency"
          :action="option.alert_type"
        />
      </tbody>
    </template>
  </sorted-table>
</template>

<script>
import { SortedTable } from 'vue-sorted-table';
import RowAlertsCreation from './row-alerts-creation.vue';
export default {
  components: {
    RowAlertsCreation,
    SortedTable,
  },
  props: {
    options: {
      type: Array,
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
