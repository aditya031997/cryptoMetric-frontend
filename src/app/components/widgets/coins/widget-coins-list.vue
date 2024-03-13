<template>
  <ul class="coins-list">
    <li
      class="coins-list__item"
      :class="{
        'coins-list__item--active': activeCoinId === coin.coin_id,
      }"
      v-for="coin in coins"
      :key="coin.id"
      @click="activeCoinId !== coin.coin_id && $emit('set-active-coin', coin.coin_id)"
    >
      <coin-stats
        :id="coin.coin_id"
        :name="coin.name"
        :slug="coin.slug"
        :symbol="coin.symbol"
        :price="coin.price_usd"
        :percent="coin.percent_change_24h"
      />
    </li>
  </ul>
</template>

<script>
import CoinStats from '@/components/coin/coin-stats.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'widget-coins-list',
  components: { CoinStats },
  props: {
    activeCoinId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({}),
  methods: {},
  computed: {
    ...mapGetters({
      coins: 'getTop5Coins',
    }),
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
