<template>
  <tr>
    <td class="table-col d-flex">
      <button-favorite
        is-short
        :coin="coin"
        :is-active="isFavoriteCoin"
      />
      <p class="m-0 ml-2 text">{{ rank }}</p>
    </td>
    <td
      v-if="name && symbol && slug"
      class="table-col table-col__border-right"
    >
      <popper-chart
        :coin="coin"
        :placement="popperPlacement"
      >
        <router-link
          :to="getLink"
          class="d-flex justify-content-space-between table__link"
        >
          <default-image
            class="table__image"
            :src="getCoinImageUrl"
            alt="Coin"
          />
          <p class="table-col--name text-cod-grey">{{ name }}</p>
          <p class="table-col--symbol">{{ symbol }}</p>
        </router-link>
      </popper-chart>
    </td>
    <td
      v-if="typeof price !== 'undefined'"
      class="table-col"
    >
      <popper-tooltip
        placement="top"
        custom-class="text popper-markets m-0"
      >
        {{ priceValue }}
        <template v-slot:popper>{{ popperPrice }}</template>
      </popper-tooltip>
    </td>
    <td
      v-if="typeof marketCap !== 'undefined'"
      class="table-col"
    >
      <popper-tooltip
        placement="top"
        customClass="text popper-markets m-0"
      >
        {{ marketCapValue }}
        <template v-slot:popper>{{ popperMarketCap }}</template>
      </popper-tooltip>
    </td>
    <td
      v-if="typeof availableSupply !== 'undefined'"
      class="table-col"
    >
      <popper-tooltip
        placement="top"
        customClass="text popper-markets m-0"
      >
        {{ availableSupplyValue }}
        <template v-slot:popper>{{ popperAvailableSupply }}</template>
      </popper-tooltip>
    </td>
    <td
      v-if="typeof totalSupply !== 'undefined'"
      class="table-col"
    >
      <popper-tooltip
        placement="top"
        customClass="text popper-markets m-0"
      >
        {{ totalSupplyValue }}
        <template v-slot:popper>{{ popperTotalSupply }}</template>
      </popper-tooltip>
    </td>
    <td
      v-if="typeof percent1h !== 'undefined'"
      class="table-col text-red"
      :class="{ 'text-green': percent1h > 0 }"
    >
      <popper-tooltip
        placement="top"
        custom-class="text popper-markets m-0"
      >
        {{ percentChange1hValue }}
        <template v-slot:popper>{{ popperPercentChange1h }}</template>
      </popper-tooltip>
    </td>
    <td
      v-if="typeof percent24h !== 'undefined'"
      class="table-col text text-red"
      :class="{ 'text-green': percent24h > 0 }"
    >
      <popper-tooltip
        placement="top"
        custom-class="text m-0"
      >
        {{ percentChange24hValue }}
        <template v-slot:popper>{{ popperPercentChange24h }}</template>
      </popper-tooltip>
    </td>
    <td
      v-if="typeof volume !== 'undefined'"
      class="table-col"
    >
      <popper-tooltip
        placement="top"
        custom-class="text popper-markets m-0"
      >
        {{ volumeValue }}
        <template v-slot:popper>{{ volumePopper }}</template>
      </popper-tooltip>
    </td>
    <td class="d-sm-none d-xs-none"></td>
  </tr>
</template>

<script>
import { getImageCoin } from '@/utils/helpers/formatter-images';
import { formatPrice, formatPercent, simpleFormatPrice, simpleFormatPercent } from '@/utils/helpers/formatter';
import buttonFavorite from '@/components/ui/button/button-favorite.vue';
import PopperTooltip from '@/components/poppers/popper-tooltip.vue';
import PopperChart from '@/components/poppers/popper-chart.vue';
import MobileCheckMixin from '@/utils/mixins/mobile-check';
import DefaultImage from '@/components/default-image.vue';

export default {
  components: {
    buttonFavorite,
    PopperTooltip,
    PopperChart,
    DefaultImage,
  },
  props: {
    coin: {
      type: Object,
    },
    rank: {
      type: Number,
    },
    volume: {
      type: Number,
    },
    percent24h: {
      type: Number,
    },
    percent1h: {
      type: Number,
    },
    totalSupply: {
      type: Number,
    },
    availableSupply: {
      type: Number,
    },
    marketCap: {
      type: Number,
    },
    price: {
      type: Number,
    },
    name: {
      type: String,
    },
    symbol: {
      type: String,
    },
    slug: {
      type: String,
    },
  },
  mixins: [MobileCheckMixin],
  computed: {
    getLink() {
      return `crypto-markets/${this.slug}`;
    },
    volumeValue() {
      if (this.volume === null) {
        return 'No info';
      }
      return formatPrice(this.volume);
    },
    volumePopper() {
      if (this.volume === null) {
        return 'No info';
      }
      return simpleFormatPrice(this.volume);
    },
    percentChange24hValue() {
      if (this.percent24h === null) {
        return 'No info';
      }
      return formatPercent(this.percent24h);
    },
    popperPercentChange24h() {
      if (this.percent24h === null) {
        return 'No info';
      }
      return simpleFormatPercent(this.percent24h);
    },
    percentChange1hValue() {
      if (this.percent1h === null) {
        return 'No info';
      }
      return formatPercent(this.percent1h);
    },
    popperPercentChange1h() {
      if (this.percent1h === null) {
        return 'No info';
      }
      return simpleFormatPercent(this.percent1h);
    },
    totalSupplyValue() {
      if (this.totalSupply === null) {
        return 'No info';
      }
      return formatPrice(this.totalSupply);
    },
    popperTotalSupply() {
      if (this.totalSupply === null) {
        return 'No info';
      }
      return simpleFormatPrice(this.totalSupply);
    },
    availableSupplyValue() {
      if (this.availableSupply === null) {
        return 'No info';
      }
      return formatPrice(this.availableSupply);
    },
    popperAvailableSupply() {
      if (this.availableSupply === null) {
        return 'No info';
      }
      return formatPrice(this.availableSupply);
    },
    marketCapValue() {
      if (this.marketCap === null) {
        return 'No info';
      }
      return formatPrice(this.marketCap);
    },
    popperMarketCap() {
      if (this.marketCap === null) {
        return 'No info';
      }
      return simpleFormatPrice(this.marketCap);
    },
    priceValue() {
      if (this.price === null) {
        return 'No info';
      }
      return formatPrice(this.price);
    },
    popperPrice() {
      if (this.price === null) {
        return 'No info';
      }
      return simpleFormatPrice(this.price);
    },
    getCoinImageUrl() {
      return getImageCoin(this.slug);
    },
    isFavoriteCoin() {
      const favorites = this.$store.state.favorites.coins;
      const coinActive = !!favorites.find(
        (favorite) =>
          favorite.coin_id === this.coin?.coin_id ||
          favorite.coin?.coin_id === this.coin?.coin_id ||
          favorite.id === this.coin?.coin_id
      );
      return coinActive;
    },
    popperPlacement() {
      return this.isMobile ? 'bottom' : 'right';
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
