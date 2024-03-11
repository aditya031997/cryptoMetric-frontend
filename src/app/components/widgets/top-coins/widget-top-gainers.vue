<template>
  <cm-card
    custom-class="widget-tops__table"
    title="Top gainers today"
    :is-close-content="coins.length === 0"
    :is-load="isLoad"
  >
    <table-tops
      :options="coins"
      :is-increment="true"
    />
  </cm-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { getListenerEcho, stopListenerEcho } from '../../../utils/echo';
import TableTops from '../../tables/tops-table/table-tops.vue';
import CmCard from '../../ui/card/cm-card.vue';

export default {
  name: 'widget-top-gainers',
  components: {
    CmCard,
    TableTops,
  },
  data: () => ({
    isLoad: false,
    values: [],
  }),
  computed: {
    ...mapGetters({ coins: 'getGainers' }),
  },
  mounted() {
    this.isLoad = true;
    this.$store.dispatch('getTopGainers').finally(() => {
      this.isLoad = false;
    });
    getListenerEcho('CoinInfoUpdated', () => {
      this.isLoad = true;
      this.$store.dispatch('getTopGainers').finally(() => {
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
