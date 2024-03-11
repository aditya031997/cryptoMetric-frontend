<template>
  <responsive-table
    :titles="titles"
    :options="options"
    :responsive="responsive"
    :default-options="defaultOptionsRow"
  >
    <template #default="titles">
      <th
        v-for="title in defaultTittles"
        :key="title.id"
        class="text text-secondary text--caption"
      >
        {{ title.name }}
      </th>
      <th
        v-for="title in titles"
        :key="title.id"
        class="text text-secondary text--caption"
        scope="col"
      >
        {{ title.name }}
      </th>
    </template>
    <template #row="{ row }">
      <row-ico
        :key="row.id"
        :id="row.id"
        :price-ico="row.start_price"
        :short-name="row.name"
        :name="row.coin_name"
        :image="row.image"
        :url="row.website"
        :date-started="row.start_date"
        :date-end="row.end_date"
        :stage="row.token_sale_type"
        :goal="row.funding_target"
        :is-active-ended="isActiveEnded"
      />
    </template>
  </responsive-table>
</template>

<script>
import ResponsiveTable from '../responsive-table.vue';
import rowIco from './row-ico.vue';
export default {
  components: {
    rowIco,
    ResponsiveTable,
  },
  props: {
    options: {
      type: Array,
    },
    isActiveEnded: {
      type: Boolean,
    },
  },
  computed: {
    responsive() {
      if (this.isActiveEnded) {
        return [
          {
            max: 1440,
            min: 1310,
            elements: 5,
            pages: 1,
          },
          {
            max: 1310,
            min: 768,
            elements: 2,
            pages: 3,
          },
          {
            max: 768,
            min: 576,
            elements: 2,
            pages: 5,
          },
        ];
      }
      return [
        {
          max: 1440,
          min: 1310,
          elements: 4,
          pages: 1,
        },
        {
          max: 1310,
          min: 768,
          elements: 2,
          pages: 2,
        },
        {
          max: 768,
          min: 576,
          elements: 1,
          pages: 4,
        },
      ];
    },
    titles() {
      if (this.isActiveEnded) {
        return [
          { id: 3, name: 'ICO Price', sortedName: 'start_price' },
          { id: 4, name: 'Stage', sortedName: 'token_sale_type' },
          { id: 5, name: 'Start Date', sortedName: 'start_date' },
          { id: 6, name: 'End Date', sortedName: 'end_date' },
          { id: 7, name: 'Goal', sortedName: 'funding_target' },
        ];
      }
      return [
        { id: 4, name: 'Stage', sortedName: 'token_sale_type' },
        { id: 5, name: 'Start Date', sortedName: 'start_date' },
        { id: 6, name: 'End Date', sortedName: 'end_date' },
        { id: 7, name: 'Goal', sortedName: 'funding_target' },
      ];
    },
  },
  data: () => ({
    defaultOptionsRow: ['id', 'name', 'coin_name', 'image', 'website'],
    defaultTittles: [
      { id: 0, name: '#', sortedName: 'id' },
      { id: 1, name: 'Project', sortedName: 'full_name' },
    ],
  }),
};
</script>

<style
  lang="scss"
  scoped
></style>
