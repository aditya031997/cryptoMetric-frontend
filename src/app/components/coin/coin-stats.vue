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
        <div class="d-flex align-item-center coin__btn">
          <div
            v-if="isLoading"
            class="spinner-border spinner-border text-info mx-4"
            role="status"
          >
            <span class="sr-only">Loading...</span>
          </div>
          <template v-else>
            <button
              class="btn cm-button btn-outline-primary is-line cm-button--sm"
              @click="handleBuy"
              v-if="showButtons"
            >
              Buy
            </button>
            <button
              class="btn cm-button btn-outline-primary is-line cm-button--sm"
              @click="handleSell"
              v-if="showButtons"
              :disabled="showButtons && !showSellButton"
              :class="{ 'not-allowed': showButtons && !showSellButton }"
            >
              Sell
            </button>
          </template>
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
        </div>
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
import { reactive, ref, toRefs, watch } from 'vue';
import { useSwitchChain } from '@wagmi/vue';
import { watchChainId } from '@wagmi/core';
import PopperTooltip from '@/components/poppers/popper-tooltip.vue';

import axios from 'axios';
import {
  getImageCoin,
  getBigImageCoin,
} from '@/utils/helpers/formatter-images';
import ButtonFavorite from '@/components/ui/button/button-favorite.vue';

import IconScroll from '@/components/icons/icon-scroll.vue';
import ButtonIcon from '@/components/ui/button/button-icon.vue';
import Web3 from 'web3';
import configs from '../../../configs/configs';
import { config } from '../modals/config';

import {
  formatPrice,
  formatPercent,
  simpleFormatPrice,
} from '@/utils/helpers/formatter';
import DefaultImage from '../default-image.vue';
const symbolChainIdMap = [
  { symbol: 'MATIC', chainId: 137 },
  { symbol: 'BNB', chainId: 56 },
  { symbol: 'BASE', chainId: 8453 },
  { symbol: 'AVAX', chainId: 43114 },
  { symbol: 'ETH', chainId: 1 },
];
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
      isCheckingToken: false,
      selectedCoinName: '',
      selectedCoinSymbol: '',
      showButtons: false,
      showSellButton: true,
      tokenId: '',
      chainId: '',
      isValidSymbol: false,
      buyOrSell: '',
      isLoading: true,
    };
  },
  setup(props) {
    const { switchChain } = useSwitchChain();
    let state = ref({
      buyOrSell: '',
    });
    const setBugOrSell = (val) => {
      state.buyOrSell = val;
    };
    watchChainId(config, {
      onChange(newChainId) {
        if (newChainId && state.buyOrSell) {
          const url = new URL('/swap', window.location.origin);
          url.searchParams.set(state.buyOrSell, props.symbol);
          window.location.href = url.toString();
          state.buyOrSell = '';
        }
      },
    });

    return {
      ...toRefs(state),
      switchChain,
      setBugOrSell,
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
    getChainIdFromSymbol(symbol) {
      const entry = symbolChainIdMap.find((item) => item.symbol === symbol);
      return entry ? entry.chainId : null;
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

    async handleBuy() {
      this.selectedCoinName = this.name;
      this.selectedCoinSymbol = this.symbol;
      const targetChainId = this.getChainIdFromSymbol(this.symbol);
      const currentChainId = parseInt(localStorage.getItem('chainId'));
      const walletName = localStorage.getItem('walletName');

      this.setBugOrSell('fromToken');

      if (this.isValidSymbol && currentChainId !== targetChainId) {
        this.switchChain({ chainId: targetChainId });
        return;
      }
      // if (currentChainId?.toString() === targetChainId?.toString()) {
      const url = new URL('/swap', window.location.origin);
      url.searchParams.set('fromToken', this.symbol);
      window.location.href = url.toString();
      this.setBugOrSell('');
      // }
    },
    async handleSell() {
      this.selectedCoinName = this.name;
      this.selectedCoinSymbol = this.symbol;
      const targetChainId = this.getChainIdFromSymbol(this.symbol);
      const currentChainId = localStorage.getItem('chainId');
      this.setBugOrSell('toToken');

      if (this.isValidSymbol) {
        return this.switchChain({ chainId: targetChainId });
      }

      // if (currentChainId.toString() === targetChainId.toString()) {
      const url = new URL('/swap', window.location.origin);
      url.searchParams.set('toToken', this.symbol);
      window.location.href = url.toString();
      this.setBugOrSell('');
      // }
    },
    async checkTokenAvailability() {
      if (this.isCheckingToken) {
        return; // Prevent multiple calls
      }

      this.isCheckingToken = true; // Set flag to true to indicate function is in progress

      try {
        console.log('here11');
        const response = await axios.get(
          `${configs.NODE_API_URL}/supply/tokenDetail?symbol=${this.symbol}`
        );
        const validSymbols = ['MATIC', 'BNB', 'BASE', 'AVAX', 'ETH'];
        const symbol = response?.data?.msg[0]?.symbol;
        this.isValidSymbol = validSymbols.includes(symbol);
        const category = response?.data?.msg[0]?.category;
        const platform = response?.data?.msg[0]?.platform;
        if (category === 'token' && platform.length > 0) {
          this.showButtons = true;
        } else if (category === 'coin' && this.isValidSymbol) {
          this.showButtons = true;
          this.showSellButton = false;
        } else if (category === 'token' && platform.length === 0) {
          this.showButtons = false; 
          this.showSellButton = false;
        } else {
          this.showButtons = false;
          this.showSellButton = false;
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
        this.showButtons = false;
        this.showSellButton = false;
      } finally {
        this.isLoading = false; // Set isLoading to false after the API request is completed
        this.isCheckingToken = false; // Reset flag to allow future calls
      }
    },
  },
  async mounted() {
    if (window.location.pathname.includes('/crypto-markets')) {
      this.checkTokenAvailability();
    }
  },
};
</script>

<style scoped>
.iframe-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.not-allowed {
  cursor: not-allowed;
}
.custom-iframe {
  width: 100%;
  height: 600px;
}
</style>
