<template>
  <div class="ml-n4 pt-4 d-flex align-items-center flex-wrap">
    <div
      class="ml-4 mt-1"
      v-if="this.coin.market_cap_usd"
    >
      <p class="m-0 text text--caption text-secondary">Market Cap</p>
      <p class="m-0 mt-1 text text-truncate">
        {{ getMarketCupFormat }}
      </p>
    </div>
    <div
      class="ml-4 mt-1"
      v-if="this.coin.available_supply"
    >
      <p class="m-0 text text--caption text-secondary">Available Supply</p>
      <p class="m-0 mt-1 text text-truncate">
        {{ getAvailableSupply }}
      </p>
    </div>
 
    <div
      class="ml-4 mt-1"
      v-if="this.coin.total_supply"
    >
      <p class="m-0 text text--caption text-secondary">Total Supply</p>
      <p class="m-0 mt-1 text text-truncate">
        {{ getTotalSupply }}
      </p>
    </div>
    <div
      class="ml-4 mt-1"
      v-if="this.coin.percent_change_24h"
    >
      <p class="m-0 text text--caption text-secondary">% Change 24h</p>
      <p
        class="m-0 mt-1 text text-truncate"
        :class="parseFloat(coin.percent_change_24h) < 0 ? 'text-danger' : 'text-success'"
      >
        {{ getPercent24Format }}
      </p>
    </div>
    <div
      class="ml-4 mt-1"
      v-if="this.coin.percent_change_7d"
    >
      <p class="m-0 text text--caption text-secondary">% Change 1w</p>
      <p
        class="m-0 mt-1 text text-truncate"
        :class="parseFloat(coin.percent_change_7d) < 0 ? 'text-danger' : 'text-success'"
      >
        {{ getPercentWeekFormat }}
      </p>
    </div>
    <div
      class="ml-4 mt-1"
      v-if="this.coin.volume_usd_24h"
    >
      <p class="m-0 text text--caption text-secondary">Volume 24h</p>
      <p class="m-0 mt-1 text text-truncate">
        {{ getVolume }}
      </p>
    </div>
  </div>
</template>

<script>
import { simpleFormatPrice, formatPercent } from '@/utils/helpers/formatter';
export default {
  props: {
    coin: {
      type: Object,
    },
  },
  computed: {
    getMarketCupFormat() {
      return simpleFormatPrice(this.coin.market_cap_usd);
    },
    getPercent24Format() {
      return formatPercent(this.coin.percent_change_24h);
    },
    getPercentWeekFormat() {
      return formatPercent(this.coin.percent_change_7d);
    },
    getTotalSupply() {
      return this.coin.total_supply;
    },
    getAvailableSupply() {
      return this.coin.available_supply;
    },
    getVolume() {
      return simpleFormatPrice(this.coin.volume_usd_24h);
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
