<template>
  <tr class="table__row">
    <td class="text table__row-text">
      <button-favorite
        is-short
        :coin="coin"
        :is-active="isFavoriteCoin"
      />
    </td>
    <td class="text d-flex align-items">
      <default-image
        class="table__image"
        :src="getCoinImageUrl"
        alt="Coin"
      />
      <p class="table-col--name table__row-text">{{ name }}</p>
      <p class="table-col--symbol d-none d-sm-block table__row-text">{{ symbol }}</p>
      <popper-tooltip class="table-col--symbol d-block d-xs-none d-sm-none d-md-none table__row-text">
        {{ symbol }}
        <template v-slot:popper>
          {{ name }}
        </template>
      </popper-tooltip>
    </td>
    <td>
      <popper-tooltip
        placement="top"
        custom-class="text table__popper table__popper--coins m-0 table__row-text"
      >
        {{ priceValue }}
        <template v-slot:popper>{{ popperPrice }}</template>
      </popper-tooltip>
    </td>
    <td class="d-sm-table-cell d-none">
      <popper-tooltip
        placement="top"
        custom-class="text tables__popper m-0 table__row-text"
      >
        {{ marketCapValue }}
        <template v-slot:popper>{{ popperMarketCap }}</template>
      </popper-tooltip>
    </td>
    <td
      class="text table__row-text"
      :class="isIncrement ? 'text-success' : 'text-danger'"
    >
      <popper-tooltip
        placement="top"
        custom-class="text tables__popper m-0 table__row-text table__popper--coins "
      >
        {{ percentValue }}
        <template v-slot:popper>{{ percentDefaultValue }}</template>
      </popper-tooltip>
    </td>
  </tr>
</template>

<script>
import { getImageCoin } from '@/utils/helpers/formatter-images';
import { formatPrice, formatPercent, simpleFormatPrice, simpleFormatPercent } from '@/utils/helpers/formatter';
import buttonFavorite from '@/components/ui/button/button-favorite.vue';
import PopperTooltip from '@/components/poppers/popper-tooltip.vue';
import DefaultImage from '../../default-image.vue';

export default {
  components: {
    buttonFavorite,
    PopperTooltip,
    DefaultImage,
  },
  name: 'table-row-coin',
  props: {
    id: {
      type: Number,
    },
    coin: {
      type: Object,
    },
    isIncrement: {
      type: Boolean,
      default: false,
    },
    percent: {
      type: [String, Number],
    },
    name: {
      type: String,
    },
    symbol: {
      type: String,
    },
    price: {
      type: String,
    },
    marketCap: {
      type: String,
    },
    slug: {
      type: String,
    },
  },
  computed: {
    getCoinImageUrl() {
      return getImageCoin(this.slug);
    },
    percentValue() {
      return formatPercent(this.percent);
    },
    percentDefaultValue() {
      return simpleFormatPercent(this.percent);
    },
    priceValue() {
      return formatPrice(this.price);
    },
    popperPrice() {
      return simpleFormatPrice(this.price);
    },
    marketCapValue() {
      return formatPrice(this.marketCap);
    },
    popperMarketCap() {
      return simpleFormatPrice(this.marketCap);
    },
    isFavoriteCoin() {
      const favorites = this.$store.state.favorites.coins;
      const coinActive = !!favorites.find(
        (favorite) => favorite?.coin_id === this.id || favorite?.coin?.coin_id === this.id
      );
      return coinActive;
    },
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
