<template>
  <cm-card
    custom-class="widget-coins"
    title="Coins"
    :is-load="isLoad"
    :is-close-content="coins.length === 0"
  >
    <template v-slot:nav>
      <p class="widget-coins__sub-title">Your top 5 favorite coins</p>
    </template>
    <div class="widget-coins__card">
      <widget-coins-chart
        v-if="activeCoin"
        class="widget-coins__chart"
        :coin-slug="activeCoin.slug"
        :coin-symbol="activeCoin.symbol"
      />
      <widget-coins-list
        v-if="activeCoin"
        class="widget-coins__list"
        @set-active-coin="setActive"
        :active-coin-id="activeCoin.coin_id"
      />
    </div>
  </cm-card>
</template>

<script>
import CmCard from '../../ui/card/cm-card.vue';
import WidgetCoinsList from './widget-coins-list.vue';
import WidgetCoinsChart from './widget-coins-chart.vue';
import { mapGetters } from 'vuex';
import { getListenerEcho, stopListenerEcho } from '../../../utils/echo';

export default {
  components: {
    CmCard,
    WidgetCoinsList,
    WidgetCoinsChart,
  },
  data: () => ({
    isLoad: false,
    activeCoinId: -1,
  }),
  computed: {
    ...mapGetters({
      coins: 'getTop5Coins',
    }),
    activeCoin() {
      return this.coins.find(({ coin_id }) => coin_id === this.activeCoinId) || this.coins[0];
    },
  },
  methods: {
    setActive(id) {
      this.activeCoinId = id;
    },
  },
  mounted() {
    getListenerEcho('CoinInfoUpdated', () => {
      this.$store.dispatch('getFavorites');
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
