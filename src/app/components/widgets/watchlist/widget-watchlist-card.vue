<template>
  <button
    class="col-11 widget-watchlist__card"
    :class="{ 'is-dnd': isDnd, 'is-hover': !isDnd }"
    :to="getLink(slug)"
    @click="navigateToLink(getLink(slug))"  >
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
import { useRouter } from 'vue-router';

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
          favorite.coin_id === this.coin.id ||
          favorite.coin?.coin_id === this.coin?.id ||
          favorite.id === this.coin?.id
      );
      return !!coinActive;
    },
  },
  setup() {
    const router = useRouter();

    const getLink = (slug) => {
      return `/crypto-markets/${slug}`
    }
    const navigateToLink = (link) => {
      router
        .push(link)
        .then(() => {
        })
        .catch((error) => {
          console.error('Navigation error:', error);
        });
    };

    return {
      getLink,
      navigateToLink,
    };
  },
  // methods: {
  //   onClickCoin() {
  //     if (!this.isDnd) {
  //       this.$router.push(`crypto-markets/${this.slug}`);
  //     }
  //   },
  // },
};
</script>

<style
  lang="scss"
  scoped
></style>
