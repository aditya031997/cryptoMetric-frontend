<template>
  <page-card
    ref="page"
    :isLoad="isLoad"
    :custom-class="'mt-4'"
    is-header-no-wrap
    :is-close-content="!getUsersLength"
  >
    <template #nav>
      <cm-input
        placeholder="Search User ..."
        class-wrapper="page-users__input"
        secondary
        :value="search"
        @input="onChangeSearch"
        is-icons
      >
        <icon-search />
      </cm-input>
      <cm-button
        is-outline
        :size="'sm'"
        :on-click="onOpenModal"
        :custom-class="'ml-2 text-nowrap'"
      >
        <icon-add class="mr-2" />
        Add <span class="ml-1 d-none d-md-inline">User</span>
      </cm-button>
      <cm-modal
        :on-close="onCloseModal"
        :is-active="isModal"
        :title="'Adding New User'"
      >
        <modal-add-user :on-close="onCloseModal" />
      </cm-modal>
    </template>
    <TableUsers
      :options="userData"
      :change-page="changeTablePage"
      :page="tablePage"
    />
    <cm-pagination
      class="mt-4"
      :change-item-value="changeRowsValue"
      :current-page="getCurrent"
      :go-to-page="changePage"
      label-pagination="Rows :"
      :links="formatterPagination(getCurrent, getTotal)"
      :options-pagination="rowsOptions"
      :total="getTotal"
      :value-pagination="rows"
    />
  </page-card>
</template>

<script>
import _ from 'lodash';
import IconSearch from '../components/icons/icon-search.vue';
import TableUsers from '../components/tables/table-users/table-users.vue';
import PageCard from '../components/ui/card/page-card.vue';
import CmInput from '../components/ui/input/cm-input.vue';
import { mapGetters } from 'vuex';
import CmPagination from '../components/cm-pagination.vue';
import ModalMixin from '@/utils/mixins/modal';
import CmButton from '../components/ui/button/cm-button.vue';
import IconAdd from '../components/icons/icon-add.vue';
import CmModal from '../components/ui/modal/cm-modal.vue';
import ModalAddUser from '../components/modals/modal-add-user.vue';
import { pagination } from '../utils/helpers/pagination-create';
export default {
  mixins: [ModalMixin],
  components: {
    PageCard,
    CmInput,
    TableUsers,
    IconSearch,
    CmPagination,
    CmButton,
    IconAdd,
    CmModal,
    ModalAddUser,
  },
  data: () => ({
    isLoad: false,
    tablePage: 1,
    rows: 10,
    rowsOptions: [10, 20, 30],
    search: '',
    getUsersDebounced: null,
    userData: [],
  }),
  computed: {
    ...mapGetters(['getUsers', 'getLinksAdmin', 'getCurrent', 'getTotal', 'getUsersLength']),
    
  },
  mounted() {
    this.getUsersDebounced = _.debounce(this.getUsersAdmin, 300);
    this.isLoad = true;
    this.getUsersAdmin();
    if (this.rowsOptions.find((row) => row === Number(this.$route.query.rows))) {
      this.rows = Number(this.$route.query.rows);
    } else {
      this.rows = this.rowsOptions[0];
      this.$router.replace({ query: { ...this.$route.query, rows: this.rowsOptions[0] } });
    }
    if (this.$route.query.search) {
      this.search = this.$route.query.search;
    }
    this.$store
      .dispatch('getUsers', {
        page: this.$route.query.page,
        perPage: this.$route.query.rows,
        search: this.$route.query.search,
      })
      .finally(() => (this.isLoad = false));
  },
  methods: {
    changeTablePage(page) {
      this.tablePage = page;
    },
    changeRowsValue(rows) {
      if (rows) {
        this.rows = rows;
      } else {
        this.rows = this.rowsOptions[0];
      }
      if (Number(this.$route.query.rows) !== this.rows) {
        this.$router.replace({ query: { ...this.$route.query, page: 1, rows: this.rows } });
      }
      this.getUsersAdmin();
    },
    changePage(page, isLoad = true) {
      this.$router.replace({ query: { ...this.$route.query, page } });
      if (isLoad) {
        this.getUsersAdmin();
      }
    },
    onChangeSearch(value) {
      this.search = value;
      if (value.trim()) {
        this.$router.replace({ query: { ...this.$route.query, search: value } }).catch((error) => {
          if (error.name != 'NavigationDuplicated') {
            throw error;
          }
        });
      } else {
        this.$router.replace({ query: { ...this.$route.query, search: undefined } }).catch((error) => {
          if (error.name != 'NavigationDuplicated') {
            throw error;
          }
        });
      }
      this.changePage(1, false);
      this.getUsersDebounced();
    },
    getUsersAdmin() {
      this.isLoad = true;
      this.$store
        .dispatch('getUsers', {
          page: this.$route.query.page,
          perPage: this.rows,
          search: this.search,
        })
        .then((response) => {
          this.userData = response; 
          document.body.scrollIntoView(true);
        })
        .finally(() => (this.isLoad = false));
    },
    formatterPagination(currentPage, maxPages) {
      return pagination(currentPage, maxPages);
    },
  },
 
};
</script>

<style
  lang="scss"
  scoped
></style>
