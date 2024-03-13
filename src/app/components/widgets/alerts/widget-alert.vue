<template>
  <cm-card
    custom-class="widget-alert"
    title="Alert"
    :is-close-content="getLengthAlerts === 0"
    :is-load="isLoad"
  >
    <template v-slot:nav>
      <div class="widget-alert__nav">
        <button-icon
          custom-class="widget-alert__nav-settings"
          :on-click="onClickSettings"
        >
          <icon-settings />
        </button-icon>
        <div class="d-flex justify-content-between">
          <button-icon
            custom-class="widget-alert__arrow is-reverse"
            :disabled="getHistoryCurrent === 1"
            :on-click="onClickPrev"
          >
            <icon-arrow-horizontal />
          </button-icon>
          <button-icon
            custom-class="widget-alert__arrow"
            :disabled="getHistoryCurrent === getHistoryTotalPage"
            :onClick="onClickNext"
          >
            <icon-arrow-horizontal />
          </button-icon>
        </div>
      </div>
    </template>
    <div
      v-if="getHistoryTotal"
      class="widget-alert__typography"
    >
      <p class="widget-alert__text">You have {{ getHistoryTotal }} Alerts</p>
      <cm-link
        custom-class="widget-alert__link text-nowrap"
        :to="'/alerts#all-alerts'"
      >
        View all
      </cm-link>
    </div>
    <alerts-list :alerts="getHistoryAlerts" />
  </cm-card>
</template>

<script>
import { mapGetters } from 'vuex';
import IconArrowHorizontal from '../../icons/icon-arrow-horizontal.vue';
import IconSettings from '../../icons/icon-settings.vue';
import ButtonIcon from '../../ui/button/button-icon.vue';
import CmCard from '../../ui/card/cm-card.vue';
import CmLink from '../../ui/link/cm-link.vue';
import AlertsList from '../../alerts/alerts-list.vue';
import { getListenerEcho, stopListenerEcho } from '@/utils/echo';

export default {
  components: {
    CmCard,
    ButtonIcon,
    IconSettings,
    CmLink,
    IconArrowHorizontal,
    AlertsList,
  },
  data: () => ({
    isLoad: false,
  }),
  computed: {
    ...mapGetters(['getHistoryAlerts', 'getHistoryTotal', 'getHistoryCurrent', 'getHistoryTotalPage']),
    getLengthAlerts() {
      return this.$store.state.alerts.alerts.length;
    },
  },
  methods: {
    onClickSettings() {
      this.$router.push({ name: 'alerts' });
    },
    onClickNext() {
      this.isLoad = true;
      this.$store
        .dispatch('getHistoryAlerts', { page: this.$store.state.alerts.current + 1, per_page: 4 })
        .finally(() => {
          this.isLoad = false;
        });
    },
    onClickPrev() {
      this.$store
        .dispatch('getHistoryAlerts', { page: this.$store.state.alerts.current - 1, per_page: 4 })
        .finally(() => {
          this.isLoad = false;
        });
    },
  },
  mounted() {
    this.isLoad = true;
    this.$store.dispatch('getHistoryAlerts', { per_page: 4 }).finally(() => {
      this.isLoad = false;
    });
    getListenerEcho('CoinInfoUpdated', () => {
      this.isLoad = true;
      this.$store.dispatch('getHistoryAlerts', { isEcho: true, per_page: 4 }).finally(() => {
        this.isLoad = false;
      });
    });
  },
  beforeDestroy() {
    stopListenerEcho('CoinInfoUpdated')
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
