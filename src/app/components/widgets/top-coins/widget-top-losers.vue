<template>
  <cm-card
    custom-class="widget-tops__table"
    title="Top losers today"
    :is-close-content="coins.length === 0"
    :is-load="isLoad"
  >
    <table-tops :options="coins" />
  </cm-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { getListenerEcho, stopListenerEcho } from '../../../utils/echo';
import TableTops from '../../tables/tops-table/table-tops.vue';
import CmCard from '../../ui/card/cm-card.vue';
export default {
  name: 'widget-top-losers',
  components: {
    CmCard,
    TableTops,
  },
  data: () => ({
    isLoad: false,
  }),
  computed: {
    ...mapGetters({ coins: 'getLosers' }),
  },
  mounted() {
    this.isLoad = true;
    this.$store.dispatch('getTopLosers').finally(() => {
      this.isLoad = false;
    });
    getListenerEcho('CoinInfoUpdated', () => {
      this.isLoad = true;
      this.$store.dispatch('getTopLosers').finally(() => {
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
