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
      :options="localOptions" 
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
          :status="row.invitation_status" 
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
    options: { // Existing options prop containing user data
      type: Array,
      required: true,
    },
    changePage: {
      type: Function,
    },
    page: {
      type: Number,
    },
    search: {
      type: String,
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
        { id: 5, name: 'User Verified', sortedName: 'invitation_status' },
        { id: 6, name: 'Action', sortedName: 'is_admin' },
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
      
      // Create a local copy of options to manage state
      localOptions: [] 
    };
  },
  
  computed: {
    ...mapGetters(['getUsers', 'getUsersLength']),
  },

  mounted() {
    this.isLoad = true;
    
    // Initialize localOptions with the prop value
    this.localOptions = [...this.options]; // Copy initial options
    this.loadData(); // Load initial data on mount
  },

  methods: {
    ...mapActions(['deleteUser']),

    loadData() {
      this.isLoad = true;
      
      // Fetch users from the store or API based on current page and search
      this.$store.dispatch('getUsers', {
        page: this.page,
        perPage: 10,
        search: this.search,
      })
      .then(response => {
        this.localOptions = response.data; // Ensure response.data contains the user list
      })
      .catch(error => {
        console.error('Failed to load users:', error);
      })
      .finally(() => {
        this.isLoad = false;
      });
    },

    onChangePage(page) {
      this.changePage(page);
      
      // Reload data when page changes
      this.loadData();
    },

    openDeleteModal(user) {
      this.selectedUser = user;
      this.isDeleteModalVisible = true;
    },

    closeDeleteModal() {
      this.isDeleteModalVisible = false;
      this.selectedUser = null;
    },

    confirmDelete(userId) {
      const Msg = 'User deleted successfully';
      
      this.isLoad = true;

      // Call the delete action
      this.deleteUser(userId)
        .then(() => {
          // Remove the deleted user from localOptions array
          this.localOptions = this.localOptions.filter(user => user.id !== userId);
          
          notification.notify({
            title: 'Delete',
            text: Msg,
            type: 'success',
            duration: 2000,
            speed: 1000,
            position: 'top right',
            classes: 'custom-notification',
          });
          
          this.closeDeleteModal(); // Close the modal after deletion
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