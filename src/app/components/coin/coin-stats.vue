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
        <div
          class="d-flex align-item-center coin__btn"
          v-if="showButtons"
        >
          <template>
            <button
              class="btn cm-button btn-outline-primary is-line cm-button--sm"
              @click="handleBuy"
            >
              Buy
            </button>
            <button
              class="btn cm-button btn-outline-primary is-line cm-button--sm"
              @click="handleSell"
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
        <div v-else>
          <p>Loading...</p>
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
import axios from 'axios';
import {
  getImageCoin,
  getBigImageCoin,
} from '@/utils/helpers/formatter-images';
import ButtonFavorite from '@/components/ui/button/button-favorite.vue';
import PopperTooltip from '@/components/poppers/popper-tooltip.vue';
import IconScroll from '@/components/icons/icon-scroll.vue';
import ButtonIcon from '@/components/ui/button/button-icon.vue';
import Web3 from 'web3';
import configs from '../../../configs/configs';

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
      showButtons: false,
      tokenId: '',
      chainId: '',
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
    async fetchChainId() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // const walletInfo =  await window.ethereum.request({ method: 'eth_requestAccounts' });
          const networkId = await web3.eth.net.getId();
          this.chainId = `0x${Number(networkId).toString(16)}`;
          // Call checkTokenAvailability after fetching the chainId
          this.checkTokenAvailability();
        } catch (error) {
          console.error('Error fetching network ID:', error);
        }
      }
    },
    async handleBuy() {
      this.selectedCoinName = this.name;
      this.selectedCoinSymbol = this.symbol;
      // // Switch network if tokenId is not equal to chainId
      // if (this.tokenId !== this.chainId) {
      //   await this.switchNetwork();
      // }
      // Redirect to the swap page with the symbol as a query parameter
      const url = new URL('/swap', window.location.origin);
      url.searchParams.set('fromToken', this.symbol);
      window.location.href = url.toString();
    },
    async handleSell() {
      this.selectedCoinName = this.name;
      this.selectedCoinSymbol = this.symbol;
      // Redirect to the swap page with the symbol as a query parameter
      // if (this.tokenId !== this.chainId) {
      //   await this.switchNetwork();
      // }
      const url = new URL('/swap', window.location.origin);
      url.searchParams.set('toToken', this.symbol);
      window.location.href = url.toString();
    },
    // async switchNetwork() {
    //   if (!window.ethereum) return alert('MetaMask is not installed');

    //   const hexChainId = `0x${parseInt(this.tokenId, 10).toString(16)}`;

    //   try {
    //     await window.ethereum.request({
    //       method: 'wallet_switchEthereumChain',
    //       params: [{ chainId: hexChainId }],
    //     });
    //     this.isDropdownVisible = false;
    //   } catch (switchError) {
    //     console.error('Failed to switch the network:', switchError);
    //   }
    // },
    checkTokenAvailability() {
      const decimalChainId = parseInt(this.chainId, 16);
      axios
        .get(`http://localhost:5000/supply/tokenDetail?symbol=${this.symbol}`)
        .then((response) => {
          const validSymbols = ['MATIC', 'BNB', 'BASE', 'AVAX', 'ETH'];
          const symbol = response?.data?.msg[0]?.symbol;
          const isValidSymbol = validSymbols.includes(symbol);
          // if (isValidSymbol) {
          //   console.log(`Symbol ${symbol} is valid.`);
          // } else {
          //   console.log(`Symbol ${symbol} is not valid.`);
          // }

          if (
            (response?.data && response?.data?.msg[0]?.category == 'token') ||
            (response?.data &&
              response?.data?.msg[0]?.category == 'coin' &&
              validSymbols.includes(response?.data?.msg[0]?.symbol))
          ) {
            this.showButtons = true;
          } else {
            this.showButtons = false;
          }
        })
        .catch((error) => {
          console.error('Error fetching token data:', error);
          this.showButtons = false;
        });
    },
  },
  async mounted() {
    await this.fetchChainId();
  },
};
</script>

<style scoped>
.iframe-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.custom-iframe {
  width: 100%;
  height: 600px;
}
</style>
