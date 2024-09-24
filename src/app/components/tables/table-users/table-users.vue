<template>
  <page-card
    ref="page"
    :isLoad="isLoad"
    :custom-class="'mt-4'"
    is-header-no-wrap
    :is-close-content="!getUsersLength"
  >
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
          @open-delete-modal="openDeleteModal"
        />
      </template>
    </responsive-table>

    <delete-modal
      v-if="isDeleteModalVisible"
      :isVisible="isDeleteModalVisible"
      :user="selectedUser"
      @close="closeDeleteModal"
      @delete="confirmDelete"
    />
  </page-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ResponsiveTable from '../responsive-table.vue';
import RowUsers from './row-users.vue';
import DeleteModal from '../../modals/modal-delete.vue';
import PageCard from '../../../components/ui/card/page-card.vue';
import _ from 'lodash'; // Ensure lodash is imported
import { useNotification } from '@kyvg/vue3-notification';

const notification = useNotification();

export default {
  components: {
    ResponsiveTable,
    RowUsers,
    DeleteModal,
    PageCard,
  },
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
  data() {
    return {
      defaultTittles: [
        { id: 0, name: 'ID' },
        { id: 1, name: 'Name' },
      ],
      titles: [
        { id: 2, name: 'Email', sortedName: 'email' },
        { id: 3, name: 'Registration date', sortedName: 'created_at' },
        { id: 4, name: 'Role', sortedName: 'is_admin' },
        { id: 5, name: 'Action', sortedName: 'is_admin' },
      ],
      responsive: [
        { max: 1600, min: 991, elements: 6, pages: 1 },
        { max: 991, min: 650, elements: 4, pages: 2 },
        { max: 650, min: 0, elements: 3, pages: 2 },
      ],
      defaultOptionsRow: ['id', 'firstname', 'lastname'],
      isDeleteModalVisible: false,
      selectedUser: null,
      isLoad: false,
    };
  },
  computed: {
    ...mapGetters(['getUsers', 'getUsersLength']),
  },
  mounted() {
    console.log('Initial options:', this.options);
    this.isLoad = true;
    this.getUsersAdmin();
  },
  methods: {
    ...mapActions(['deleteUser']),

    onChangePage(page) {
      this.changePage(page);
    },
    openDeleteModal(user) {
      this.selectedUser = user;
      this.isDeleteModalVisible = true;
    },
    closeDeleteModal() {
      this.isDeleteModalVisible = false;
      this.selectedUser = null;
    },
    getUsersAdmin() {
      this.isLoad = true;
      this.$store
        .dispatch('getUsers')
        .then((response) => {
          console.log(response.data, 'response111');
        })
        .finally(() => {
          this.isLoad = false;
        });
    },
    confirmDelete(userId) {
      const Msg = 'User deleted successfully';
      // console.log(`Deleting user with ID: ${userId}`);
      this.isLoad = true;

      this.deleteUser(userId)
        .then(() => {
          notification.notify({
            title: 'Disconnected',
            text: Msg,
            type: 'success',
            duration: 2000,
            speed: 1000,
            position: 'top right',
            classes: 'custom-notification',
          });
          // console.log('User deleted successfully');
          this.getUsersAdmin();
          this.closeDeleteModal();
        })
        .catch((error) => {
          console.error('Failed to delete user:', error);
        })
        .finally(() => {
          this.isLoad = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
table tr th:last-child {
  text-align: center;
}
.custom-notification {
  margin-top: 20px;
}
</style>
