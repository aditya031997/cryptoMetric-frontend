<template>
  <div
    class="coin-stats"
    :class="{ 'is-dnd': isDnd, 'is-page': isCoinPage }"
  >
    <div class="coin-stats__title">
      <div class="coin-stats__coin">
        <default-image
          class="coin-stats__coin-image"
          :src="getCoinImageUrl"
          :alt="`${name} coin icon`"
        />
        <div class="coin-stats__popper-wrapper">
          <popper-tooltip
            custom-class="coin-stats__coin-name text ml-2"
            placement="top"
            :disabled="isDnd || poppersOff"
          >
            {{ name }}
            <template v-slot:popper>{{ name }}</template>
          </popper-tooltip>
        </div>
        <p class="text coin-stats__coin-name-short">
          {{ symbol }}
        </p>
      </div>

      <template v-if="hasButton">
        <button @click="handleBuy">
        Buy
      </button>
      <button @click="handleSell">
        Sell
      </button>
        <button-favorite
          v-if="!isDnd"
          :is-short="!isCoinPage"
          :coin="coin"
          :is-active="isFavorite"
        />
        <button-icon
          v-else
          custom-class="coin-stats__handle"
        >
          <icon-scroll />
        </button-icon>
      </template>
    </div>
    <div class="coin-stats__typography">
      <div class="coin-stats__popper-wrapper">
        <popper-tooltip
          custom-class="coin-stats__typography-value text"
          placement="top"
          :disabled="isDnd || poppersOff"
          v-if="this.price"
        >
          {{ priceFixed }}
          <template v-slot:popper>{{ pricePopup }}</template>
        </popper-tooltip>
      </div>
      <p
        class="coin-stats__typography-percent text"
        :class="{
          'text-danger': parseFloat(percent) < 0,
          'text-success': parseFloat(percent) > 0,
        }"
        v-if="this.percent"
      >
        {{ percentFixed }}
      </p>
    </div>
  </div>
</template>


<script>
import {
  getImageCoin,
  getBigImageCoin,
} from '@/utils/helpers/formatter-images';
import ButtonFavorite from '@/components/ui/button/button-favorite.vue';
import PopperTooltip from '@/components/poppers/popper-tooltip.vue';
import IconScroll from '@/components/icons/icon-scroll.vue';
import ButtonIcon from '@/components/ui/button/button-icon.vue';

import {
  formatPrice,
  formatPercent,
  simpleFormatPrice,
} from '@/utils/helpers/formatter';
import DefaultImage from '../default-image.vue';

export default {
  name: 'coin-stats',
  components: {
    PopperTooltip,
    ButtonFavorite,
    IconScroll,
    ButtonIcon,
    DefaultImage,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: false,
    },
    symbol: {
      type: [String, Number],
      required: false,
    },
    price: {
      type: [String, Number],
      required: false,
    },
    percent: {
      type: [Number, String],
      required: false,
    },
    hasButton: {
      type: Boolean,
      default: false,
    },
    isDnd: {
      type: Boolean,
      default: false,
    },
    coin: {
      type: Object,
    },
    isCoinPage: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    poppersOff: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modelValue: this.value,
      selectedCoinName: '',
      selectedCoinSymbol: '',
    };
  },
  computed: {
    getCoinImageUrl() {
      if (this.isCoinPage) {
        return getBigImageCoin(this.slug);
      }
      return getImageCoin(this.slug);
    },
    percentFixed() {
      return formatPercent(this.percent);
    },
    priceFixed() {
      return formatPrice(this.price);
    },
    pricePopup() {
      return simpleFormatPrice(this.price);
    },
  },
  methods: {
    resetValue() {
      if (this.isFilter) {
        this.modelValue = { name: 'All', value: null };
        this.onChange(this.defaultValue, this.index);
        if (this.resetOption) {
          this.resetOption();
        }
      }
    },
    getImageCoin(slug) {
      if (slug) {
        return getImageCoin(slug);
      }
      return '';
    },
    handlerChangeSelect(value) {
      this.modelValue = value;
      this.onChange(value, this.index);
    },
    handleBuy() {
      this.selectedCoinName = this.name;
      this.selectedCoinSymbol = this.symbol;
      // Handle the buy action here
      console.log(`Buying ${this.selectedCoinName} (${this.selectedCoinSymbol})`);
    },
    handleSell() {
      this.selectedCoinName = this.name;
      this.selectedCoinSymbol = this.symbol;
      // Handle the sell action here
      console.log(`Selling ${this.selectedCoinName} (${this.selectedCoinSymbol})`);
    },
  },
};
</script>

