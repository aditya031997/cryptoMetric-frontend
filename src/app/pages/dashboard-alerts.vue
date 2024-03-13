<template>
  <div
    v-if="!isLoad"
    class="d-flex align-start flex-wrap ml-n4"
  >
    <cm-card
      title="List"
      custom-class="mt-4 ml-4 page-alerts__card--list"
      :is-close-content="getAlertsUserLength === 0"
      text-close-content="is empty"
    >
      <template #nav>
        <cm-button
          is-outline
          size="sm"
          :on-click="onOpenModal"
        >
          <icon-add />
          Create Alert
        </cm-button>
        <cm-modal
          :is-active="isModal"
          :on-close="onCloseModal"
          title="Creating Alert"
        >
          <modal-alert :on-close-modal="onCloseModal" />
        </cm-modal>
      </template>
      <table-alerts-creation :options="getAlertsUser" />
    </cm-card>
    <cm-card
      title="Settings"
      custom-class="mt-4 ml-4 page-alerts__card--settings"
      is-border
    >
      <alerts-settings />
    </cm-card>
    <cm-card
      title="All Alerts"
      ref="alerts"
      :custom-class="getClassHistoryAlerts"
      :is-close-content="getLengthAlerts === 0"
      :is-oad="isLoadHistory"
      id="all-alerts"
    >
      <template #nav>
        <p
          class="m-0 text text-grey-mid text--caption-2"
          v-if="getHistoryTotal > 0"
        >
          You have {{ getHistoryTotal }} Alerts
        </p>
      </template>
      <alerts-list
        :alerts="getHistoryAlerts"
        is-alerts-page
      />
      <cm-pagination
        :changeItemValue="changeRows"
        :currentPage="getHistoryCurrent"
        :goToPage="changePage"
        labelPagination="Show rows:"
        :links="formatterPagination(getHistoryCurrent, getHistoryTotalPage)"
        :optionsPagination="rowsPagination"
        :total="getHistoryTotalPage"
        :valuePagination="rows"
        is-rows
      />
    </cm-card>
  </div>
  <cm-loader v-else />
</template>

<script>
import CmCard from '../components/ui/card/cm-card.vue';
import AlertsList from '../components/alerts/alerts-list.vue';
import AlertsSettings from '../components/alerts/alerts-settings.vue';
import { mapGetters } from 'vuex';
import TableAlertsCreation from '../components/tables/alerts-creation/table-alerts-creation.vue';
import CmLoader from '../components/ui/loader/cm-loader.vue';
import CmButton from '../components/ui/button/cm-button.vue';
import IconAdd from '../components/icons/icon-add.vue';
import ModalAlert from '../components/modals/modal-alert.vue';
import CmModal from '../components/ui/modal/cm-modal.vue';
import CmPagination from '../components/cm-pagination.vue';
import ModalMixin from '@/utils/mixins/modal';
import { getListenerEcho, stopListenerEcho } from '../utils/echo';
import { pagination } from '../utils/helpers/pagination-create';
export default {
  mixins: [ModalMixin],
  components: {
    CmCard,
    AlertsList,
    AlertsSettings,
    TableAlertsCreation,
    CmLoader,
    IconAdd,
    CmButton,
    ModalAlert,
    CmModal,
    CmPagination,
  },
  data: () => ({
    rows: 10,
    rowsPagination: [5, 10, 20],
    isLoad: false,
    isLoadHistory: false,
    isScroll: false,
  }),
  computed: {
    ...mapGetters([
      'getHistoryAlerts',
      'getHistoryTotal',
      'getHistoryCurrent',
      'getHistoryTotalPage',
      'getAlertsUser',
      'getAlertsUserLength',
      'getHistoryLinks',
    ]),
    getClassHistoryAlerts() {
      if (this.isScroll) {
        return 'mt-4 ml-4 page-alerts__card--alerts cm-card--padding-scroll';
      }
      return 'mt-4 ml-4 page-alerts__card--alerts';
    },
    getLengthAlerts() {
      return this.$store.state.alerts.alerts.length;
    },
  },
  methods: {
    scrollTo(element, yOffset) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y });
    },
    changePage(page) {
      this.isLoadHistory = true;
      this.scrollTo(this.$refs.alerts.$vnode.elm, -90);
      this.$store
        .dispatch('getHistoryAlerts', {
          page: page,
          per_page: this.rows,
        })
        .finally(() => {
          this.isLoadHistory = false;
        });
    },
    changeRows(value) {
      this.scrollTo(this.$refs.alerts.$vnode.elm, -90);
      if (!value) {
        this.rows = this.rowsPagination[0];
      } else {
        this.rows = value;
      }
      this.isLoadHistory = true;
      this.$store.dispatch('getHistoryAlerts', { page: 1, per_page: this.rows }).finally(() => {
        this.isLoadHistory = false;
      });
    },
    formatterPagination(currentPage, maxPages) {
      return pagination(currentPage, maxPages);
    },
  },
  mounted() {
    this.isLoad = true;
    Promise.all([
      this.$store.dispatch('getAlertsUser'),
      this.$store.dispatch('getHistoryAlerts', { per_page: this.rows }),
    ]).finally(() => {
      this.isLoad = false;
    });
    getListenerEcho('CoinInfoUpdated', () => {
      this.isLoad = true;
      this.$store
        .dispatch('getHistoryAlerts', {
          per_page: this.rows,
          isEcho: true,
        })
        .finally(() => {
          this.isLoad = false;
        });
    });
  },
  beforeDestroy() {
    stopListenerEcho('CoinInfoUpdated');
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
