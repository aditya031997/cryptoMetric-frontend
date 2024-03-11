<template>
  <button
    class="col-11 widget-watchlist__card"
    :class="{ 'is-dnd': isDnd, 'is-hover': !isDnd }"
    @click="onClickCoin"
  >
    <coin-stats
      :id="id"
      :name="coinName"
      :slug="slug"
      :symbol="coinSymbol"
      :price="price"
      :percent="percent"
      :isDnd="isDnd"
      :coin="coin"
      :is-favorite="isFavorite"
      has-button
      is-watchlist
    />
    <google-trends-card :symbol="coinSymbol" />
  </button>
</template>

<script>
import CoinStats from '@/components/coin/coin-stats.vue';
import GoogleTrendsCard from './google-trends-card.vue';

export default {
  components: {
    CoinStats,
    GoogleTrendsCard,
  },
  props: {
    id: {
      type: Number,
    },
    coin: {
      type: Object,
    },
    slug: {
      type: String,
    },
    isDnd: {
      type: Boolean,
      default: false,
    },
    coinImage: {
      type: String,
    },
    coinName: {
      type: String,
    },
    coinSymbol: {
      type: String,
    },
    price: {
      type: [Number, String],
    },
    percent: {
      type: [Number, String],
    },
  },
  computed: {
    isFavorite() {
      const favorites = this.$store.state.favorites.coins;
      const coinActive = favorites.find(
        (favorite) =>
          favorite.coin_id === this.coin.id || favorite.coin?.coin_id === this.coin?.id || favorite.id === this.coin?.id
      );
      return !!coinActive;
    },
  },
  methods: {
    onClickCoin() {
      if (!this.isDnd) {
        this.$router.push(`crypto-markets/${this.slug}`);
      }
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
