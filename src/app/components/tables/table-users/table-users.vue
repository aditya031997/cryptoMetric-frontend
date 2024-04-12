<template>
  <responsive-table
    :titles="titles"
    :options="options"
    :responsive="responsive"
    :default-options="defaultOptionsRow"
    :change-page="onChangePage"
    :page="page"
  >
    <template #default="titles">
      <th
        v-for="title in defaultTittles"
        :key="title.id"
        class="text text-secondary text--caption"
        scope="col"
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
      <row-users
        :id="row.id"
        :first-name="row.firstname"
        :last-name="row.lastname"
        :email="row.email"
        :is-admin="row.is_admin"
        :date="row.created_at"
      />
    </template>
  </responsive-table>
</template>

<script>
import ResponsiveTable from '../responsive-table.vue';
import rowUsers from './row-users.vue';
export default {
  components: { rowUsers, ResponsiveTable },
  props: {
    options: {
      type: Array,
    },
    changePage: {
      type: Function,
    },
    page: {
      type: Number,
    },
  },
  data: () => ({
    defaultTittles: [
      { id: 0, name: 'ID' },
      { id: 1, name: 'Name' },
    ],
    titles: [
      { id: 2, name: 'Email', sortedName: 'email' },
      { id: 3, name: 'Registration date', sortedName: 'created_at' },
      { id: 5, name: 'Role', sortedName: 'is_admin' },
    ],
    responsive: [
      {
        max: 1600,
        min: 991,
        elements: 3,
        pages: 1,
      },
      {
        max: 991,
        min: 650,
        elements: 2,
        pages: 2,
      },
      {
        max: 650,
        min: 0,
        elements: 1,
        pages: 2,
      },
    ],
    defaultOptionsRow: ['id', 'firstname', 'lastname'],
  }),
  methods: {
    onChangePage(page) {
      this.changePage(page);
    },
  },
  mounted() {
    console.log('options prop:', this.page);
  }
};
</script>

<style
  lang="scss"
  scoped
></style>
