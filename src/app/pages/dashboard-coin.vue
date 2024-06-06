<template>
  <div v-if="!isLoad">
    <page-card
      v-if="!errorMessage"
      custom-class="mt-4 coin-page__card"
      is-header-border-bottom
    >
      <template v-slot:nav>
        <coin-stats
          v-if="coin"
          :coin="coin"
          has-button
          :id="coin.id"
          is-coin-page
          :is-favorite="isFavorite"
          :name="coin.name"
          :percent="coin.percent_change_24h"
          :price="coin.price_usd"
          :slug="coin.slug"
          :symbol="coin.symbol"
          poppers-off
        />
      </template>
      <template v-if="coin">
        <coin-info-value :coin="coin" />
        <chart-trading-view
          class="mt-3"
          auto-init
          top-toolbar
          :style-area="false"
          :slug="coin.slug"
          :symbol="coin.symbol"
          size="tradingview-chart-lg"
        />
      </template>
    </page-card>
    <page-card
      v-if="!errorMessage"
      custom-class="mt-4"
    >
      <template v-slot:nav>
        <coin-app-bar
          :list="listBar"
          :on-change="changeAppBarElement"
        />
      </template>
      <component
        v-if="coin"
        :is="isActiveComponent.component"
        v-bind="isActiveComponent.props"
        :slug="this.$route.params.slug"
      />
    </page-card>

    <page-card  custom-class="mt-4">
      <template v-slot:nav>
        <coin-app-bar :list="SecurityListbar" :on-change="changeSecurityAppBarElement" />
      </template>
      <component
        v-if="coin"
        :is="activeSecurityComponent.component"
        v-bind="activeSecurityComponent.props"
        :slug="coin.slug"
      />
    </page-card>

    <p class="text text-center h-100 d-flex align-items-center justify-content-center text-danger text--caption">
      {{ errorMessage }}
    </p>
  </div>
  <cm-loader v-else />
</template>

<script>
import PageCard from '@/components/ui/card/page-card.vue';
import CoinStats from '@/components/coin/coin-stats.vue';
import CmLoader from '@/components/ui/loader/cm-loader.vue';
import CoinAppBar from '@/components/coin/coin-app-bar.vue';
import GoogleTrendsCard from '@/components/widgets/watchlist/google-trends-card.vue';
import CoinInfo from '@/components/coin/coin-info.vue';
import CoinExchanges from '@/components/coin/coin-exchanges.vue';
import CoinSecurity from '@/components/coin/coin-security.vue'
import CoinDistribution from '../components/coin/coin-distribution.vue';
import CoinInfoValue from '@/components/coin/coin-info-value.vue';
import ChartTradingView from '@/components/charts/trading-view.vue';
import { getListenerEcho, stopListenerEcho } from '../utils/echo';

export default {
  components: {
    PageCard,
    CoinStats,
    CmLoader,
    CoinAppBar,
    GoogleTrendsCard,
    CoinSecurity,
    CoinDistribution,
    CoinInfo,
    CoinExchanges,
    CoinInfoValue,
    ChartTradingView,
  },
  data: () => ({
    isLoad: false,
    coin: null,
    listBar: [
      {
        id: 0,
        name: 'Exchanges',
        isActive: true,
        props: {},
        component: 'coin-exchanges',
      },
      {
        id: 1,
        name: 'Coin Info',
        isActive: false,
        props: {},
        component: 'coin-info',
      },
      {
        id: 2,
        name: 'Google Trends',
        isActive: false,
        props: {},
        component: 'google-trends-card',
      },
    ],
   SecurityListbar: [
      {
        id: 0,
        name: 'Security',
        isActive: true,
        props: {},
        component: 'coin-security',
      },
      {
        id: 1,
        name: 'Supply Distribution',
        isActive: false,
        props: {},
        component: 'coin-distribution',
      },
    ],
    errorMessage: '',
  }),
  computed: {
    isActiveComponent() {
      return this.listBar.find((element) => element.isActive);
    },
     activeSecurityComponent() {
      return this.SecurityListbar.find((element) => element.isActive);
    },
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
    changeAppBarElement(indexElement) {
      this.listBar.forEach((element, index) => {
        element.isActive = index === indexElement;
      });
    },
    changeSecurityAppBarElement(indexElement) {
      this.SecurityListbar.forEach((element, index) => {
        element.isActive = index === indexElement;
      });
    },
  },
  mounted() {
    this.isLoad = true;
    this.$api
      .get(`/coins/${this.$route.params.slug}`)
      .then(({ coin }) => {
        this.coin = coin;
        this.listBar[1].props = {
          description: coin.description,
          features: coin.features,
          technology: coin.technology,
          url: coin.url,
        };
        this.listBar[2].props = {
          symbol: coin.symbol,
          isAutoHeight: true,
        };
      })
      .catch(() => {
        this.errorMessage = `Cryptocurrency data "${this.$route.params.slug}" not found, please try again later`;
      })
      .finally(() => {
        this.isLoad = false;
      });
    const src = 'https://ssl.gstatic.com/trends_nrtr/1420_RC05/embed_loader.js';
    const existedScript = document.querySelector(`[src="${src}"]`);
    if (!existedScript) {
      const head = document.head;
      const script = document.createElement('script', {});
      script.type = 'text/javascript';
      script.src = src;
      script.onload = () => {
        this.$store.commit('trendsLoaded');
      };
      head.appendChild(script);
    }
    getListenerEcho('CoinInfoUpdated', () => {
      this.isLoad = true;
      this.$api
        .get(`/coins/${this.$route.params.slug}`)
        .then(({ coin }) => {
          this.coin = coin;
          this.listBar[1].props = {
            description: coin.description,
            features: coin.features,
            technology: coin.technology,
            url: coin.url,
          };
          this.listBar[2].props = {
            symbol: coin.symbol,
            isAutoHeight: true,
          };
        })
        .catch(() => {
          this.errorMessage = `Cryptocurrency data "${this.$route.params.slug}" not found, please try again later`;
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
