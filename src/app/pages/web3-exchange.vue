<template>
  <div class="container">
    <div>
      <div class="header-btn">
        <button class="swap-btn">Swap</button>
        <div class="dropdown-btn">
          <button
            @click="toggleSlippageModal"
            class="head-right-btn"
          >
            <settingIcon />
          </button>

          <div
            v-if="showSlippageModal"
            class="slippage-modal"
          >
            <div class="modal-content">
              <div class="accordion">
                <div
                  v-for="(item, index) in accordionItems"
                  :key="index"
                  class="accordion-item"
                  :class="{ active: activeIndex === index }"
                >
                  <div
                    class="accordion-header"
                    @click="toggleAccordion(index)"
                  >
                    Max. slippage
                    <div class="accrodion-right-content">
                      <p>{{ selectedOption === 'auto' ? 'Auto' : '0.5' }}</p>
                      <dropdownIcon />
                    </div>
                  </div>
                  <div
                    class="accordion-content"
                    v-if="activeIndex === index"
                  >
                    <div class="inner-content">
                      <div class="checkbox-container">
                        <button
                          class="auto-btn"
                          :class="{ checkbtn: selectedOption === 'auto' }"
                          @click="selectOption('auto')"
                        >
                          Auto
                        </button>
                        <button
                          class="custom-btn"
                          :class="{ checkbtn: selectedOption === 'custom' }"
                          @click="selectOption('custom')"
                        >
                          Custom
                        </button>
                      </div>
                      <input
                        type="text"
                        class="input-number"
                        placeholder="0.5"
                        v-model="customSlippage"
                        @focus="setToCustom"
                        @input="setToCustom"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tokenlist">
      <div class="token-left-section">
        <label
          for="select-field-from"
          class="form-label"
          >You Pay</label
        >
        <input
          ref="fromTokenQuantityInput"
          v-model="fromTokenQuantity"
          type="text"
          min="0"
          placeholder="0"
          @input="sanitizeInput($event, 'fromTokenQuantity')"
          class="form-control number-input"
        />
        <p
          class="pay-content"
          v-if="fromTokenQuantity > 0 && fromCalculatedFiat"
        >
          ${{ fromCalculatedFiat }}
        </p>
      </div>
      <div v-if="isLoadingTokens || isLoadingBalances">Loading tokens...</div>

      <div
        v-else
        class="right-side-input-css"
      >
        <button
          class="token-btn"
          @click="
            isSwapModalVisible = true;
            handleSelectFrom();
          "
        >
          <span class="swap-list">
            <img
              v-if="selectedFromToken && selectedFromToken.logoURI"
              :src="selectedFromToken?.logoURI"
              :alt="selectedFromToken?.symbol"
              class="token-logo"
            />
            <span>{{ selectedFromToken?.symbol }}</span>
          </span>
          <span> <dropdownIcon /></span>
        </button>
        <div
          class="right-side-balance-box mt-1"
          v-if="
            fromFiat != 0 || fromFiat != '' || selectedFromTokenAddress != ''
          "
        >
          Balance: {{ fromTokenBalance }}
          <!-- <button @click="setMaxTokenQuantity">max</button> -->
        </div>
      </div>
    </div>
    <button
      @click="swapTokens"
      class="exchange-button btn"
    >
      <slipage-add />
    </button>
    <div class="tokenlist">
      <div class="token-left-section">
        <label
          for="select-field-from"
          class="form-label"
          >You Receive</label
        >
        <input
          v-model="ratio"
          type="text"
          min="0"
          placeholder="0"
          @input="sanitizeInput($event, 'ratio')"
          class="form-control number-input"
        />
        <p
          class="pay-content"
          v-if="ratio"
        >
          ${{ toCalculatedFiat }}
        </p>
      </div>
      <div class="right-side-input-css">
        <div v-if="isFetchingToToken">Fetching token...</div>
        <div v-else>
          <button
            :class="{
              'select-token-btn': true,
              selected: !!selectedReceiveToken,
            }"
            @click="
              isSwapModalVisible = true;
              handleSelectTo();
            "
          >
            <span v-if="!selectedReceiveToken && !hasToTokenParam"
              >Select Token</span
            >
            <span>
              <img
                :src="selectedReceiveToken?.logoURI"
                :alt="selectedReceiveToken?.symbol"
                class="token-logo"
              />
              <span>{{ selectedReceiveToken?.symbol }}</span>
            </span>
            <dropdownIcon />
          </button>
          <p
            class="mt-1"
            v-if="toFiat != 0 || toFiat != ''"
          >
            Balance: {{ toTokenBalance }}
          </p>
        </div>
      </div>
    </div>
    <button
      class="modal-button connect-wallet btn"
      @click="sendTrans"
      :disabled="isDisabled"
    >
      {{ buttonText }}
    </button>
    <!-- In your component template -->
    <TokenModal
      ref="tokenModal"
      :is-visible="isSwapModalVisible"
      :chain-id="137"
      @hide-modal="toggleSwapModal(false)"
      @token-selected="handleTokenSelected"
      @tokens-fetched="handleTokensFetched"
      @chainId-fetched="handleChainIdFetched"
    />
    <div
      v-if="isErrorModalVisible"
      class="error-modal"
    >
      <div class="modal-content">
        <p>{{ errorMessage }}</p>
        <button @click="closeErrorModal">Close</button>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs,ref, watch } from 'vue';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from '@wagmi/vue';
import Web3 from 'web3';
import axios from 'axios';
import TokenModal from '../components/modals/modal-swap.vue';
import '../assets/scss/pages/swap.scss';
import SwapIcon from '../assets/images/zrx-icon.png';
import Multiselect from 'vue-multiselect';
import slipageAdd from '../components/icons/slipage-add.vue';
import dropdownIcon from '../components/icons/icon-dropdown.vue';
import settingIcon from '../components/icons/icon-settings.vue';
import { ethers } from 'ethers';
import configs from '../../configs/configs';
import { useNotification } from '@kyvg/vue3-notification';

const notification = useNotification();

const abi = [
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function balanceOf(address a) view returns (uint)',
];

export default {
  name: 'web3exchange',

  components: {
    Multiselect,
    slipageAdd,
    dropdownIcon,
    SwapIcon,
    TokenModal,
    settingIcon,
  },
  props: {
    isVisible: Boolean,
    loading: Boolean,
  },
  data() {
    return {
      walletAddress: '',
      tokens: [],
      fetchedData: [],
      selectedFromToken: null,
      selectedReceiveToken: null,
      disableRecalculation: false,
      isErrorModalVisible: false,
      errorMessage: '',
      isSwapModalVisible: false,
      isLoadingTokens: false,
      isLoadingBalances: false,
      isLoadingToBalance: false,
      isFetchingToToken: false,
      initialLoadComplete: false,
      selectedToken: {},
      fromTokenQuantity: '',
      toTokenQuantity: '',
      fromTokenBalance: '',
      balanceCache: {},
      toTokenBalance: '',
      chainId: '',
      fromFiat: 0,
      toFiat: 0,
      balance: '0',
      fromCalculatedFiat: '',
      toCalculatedFiat: '',
      selectedFromTokenAddress: '',
      selectedToTokenAddress: '',
      ratio: '',
      isSwapped: false,
      showSlippageModal: false,
      customSlippage: 0.5,
      isTransactionPending: false,
      slippageType: 'auto',
      selectedOption: 'auto',
      activeIndex: null,
      accordionItems: [
        {
          title: 'Section 1',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
      ],
    };
  },

  setup() {
    const selectedOption = ref('auto')
    const { isConnected } = useAccount();
    const {
      data: hash,
      error,
      isPending,
      sendTransaction,
    } = useSendTransaction();

    let state = reactive({
      isTransactionPending: false,
      // selectedOption: 'auto',
      customSlippage: 0.5,
      chainId: '',
      selectedFromTokenAddress: '',
      selectedToTokenAddress: '',
      fromTokenQuantity: '',
      walletAddress: isConnected._object.address,
    });

    const sendTrans = async () => {
      console.log(isPending, 'isPending');
      state.isTransactionPending = isPending;
      const slippageValue =
        state.selectedOption === 'auto' ? 0.5 : state.customSlippage;
      const web3 = new Web3(window.ethereum);

      try {
        const allowanceResponse = await axios.get(
          `${configs.NODE_API_URL}/tokens/allowance`,
          {
            params: {
              tokenAddress: state.selectedFromTokenAddress,
              walletAddress: state.walletAddress,
              chain: 137,
            },
          }
        );
        const allowance = allowanceResponse.data.allowance;
        setTimeout(async () => {
          let swapData;
          if (allowance === '0') {
            await axios.get(
              `${configs.NODE_API_URL}/tokens/approveTransaction?tokenAddress=${
                state.selectedFromTokenAddress
              }&chain=${137}`
            );
          }
          swapData = {
            slippage: slippageValue,
            src: state.selectedFromTokenAddress,
            from: state.walletAddress,
            origin: state.walletAddress,
            dst: state.selectedToTokenAddress,
            chain: 137,
            amount: web3.utils.toWei(
              state.fromTokenQuantity.toString(),
              'ether'
            ),
          };

          console.log(swapData, 'hhhhthhthhhth');
          const swapResult = await axios.post(
            `http://localhost:5000/tokens/swapper`,
            swapData
          );
          sendTransaction({
            from: swapResult.data.tx.from,
            to: swapResult.data.tx.to,
            data: swapResult.data.tx.data,
            value: swapResult.data.tx.value,
            gas: swapResult.data.tx.gas,
            gasPrice: swapResult.data.tx.gasPrice,
          });
        });
      } catch (error) {
        state.isTransactionPending = false;
        console.error('Error sending transaction:', error);
      }
    };

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
      useWaitForTransactionReceipt({
        hash,
      });

      
    return {
      ...toRefs(state),
      hash,
      error,
      isPending,
      sendTrans,
      isConnected,
    };
  },
  methods: {
    customLabel({ name, symbol }) {
      return `${name} ${symbol}`;
    },
    toggleSwapModal(show) {
      this.isSwapModalVisible = show;
    },
    showErrorModal(message) {
      this.errorMessage = message;
      this.isErrorModalVisible = true;
    },
    closeErrorModal() {
      this.isErrorModalVisible = false;
      this.errorMessage = '';
    },
    handleSelectFrom() {
      this.isSelectingFrom = true;
    },
    handleSelectTo() {
      this.isSelectingFrom = false;
    },
    getUrlParameter(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    },
    async fetchTokens() {
      this.isLoadingTokens = true;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      try {
        const response = await axios.get(
          `${configs.NODE_API_URL}/tokens/swager?chain=${137}`
        );
        this.fetchedData = response.data.msg.tokens;
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        this.isLoadingTokens = false;
      }
    },
    async setTokenFromParams() {
      const fromTokenSymbol = this.getUrlParameter('fromToken');
      const toTokenSymbol = this.getUrlParameter('toToken');
      let fromTokenSet = false;
      let toTokenSet = false;

      if (fromTokenSymbol) {
        const fromToken = Object.values(this.tokens).find(
          (token) => token.symbol === fromTokenSymbol
        );
        if (fromToken) {
          this.selectedFromToken = fromToken;
          this.selectedFromTokenAddress = fromToken?.address;
          await this.updateTokenBalance(fromToken, true);
          fromTokenSet = true;
        } else {
          this.showErrorModal(
            'Token does not exist on this chain ID. Please change the chain ID.'
          );
          this.selectedFromToken = null;
          this.selectedFromTokenAddress = '';
        }
      }

      if (toTokenSymbol) {
        this.isFetchingToToken = true;
        const toToken = Object.values(this.tokens).find(
          (token) => token.symbol === toTokenSymbol
        );
        if (toToken) {
          this.selectedReceiveToken = toToken;
          this.selectedToTokenAddress = toToken?.address;
          console.log(toToken, 'toToken');
          await this.updateTokenBalance(toToken, false);
          toTokenSet = true;
        } else {
          this.showErrorModal(
            'Token does not exist on this chain ID. Please change the chain ID.'
          );
          this.selectedToken = null;
          this.selectedToTokenAddress = '';
        }
        this.isFetchingToToken = false;
      }

      if (!fromTokenSet) {
        this.setDefaultToken();
      }
    },
    handleTokensFetched(tokens) {
      this.tokens = tokens;
      this.setDefaultToken();
    },
    handleChainIdFetched(chainId) {
      if (chainId) {
        this.setTokenFromParams();
      }
    },
    handleTokenSelected(token) {
      if (this.isSelectingFrom) {
        this.selectedFromToken = token;
        this.selectedFromTokenAddress = token?.address;
        this.updateTokenBalance(token, true);
      } else {
        this.selectedReceiveToken = token;
        this.selectedToTokenAddress = token?.address;
        this.updateTokenBalance(token, false);
      }
      this.isSwapModalVisible = false;
    },
    async updateTokenBalance(token, isFrom) {
      let loadingFlag = isFrom ? 'isLoadingFromBalance' : 'isLoadingToBalance';
      const cacheKey = token?.address + (isFrom ? '_from' : '_to');
      if (this.balanceCache[cacheKey]) {
        if (isFrom) {
          this.fromFiat = this.balanceCache[cacheKey].fiat;
          this.fromTokenBalance = this.balanceCache[cacheKey].balance;
        } else {
          this.toFiat = this.balanceCache[cacheKey].fiat;
          this.toTokenBalance = this.balanceCache[cacheKey].balance;
        }
        this.calculateRatio();
        return;
      }

      if (this[loadingFlag]) {
        return;
      }

      this[loadingFlag] = true;

      try {
        await new Promise((resolve) => setTimeout(resolve, 4000));
        if (token?.address) {
          const response = await axios.get(
            `${configs.NODE_API_URL}/tokens/convert?chain=${137}&addresses=${
              token?.address
            }`
          );
          const fiatValue = response.data.msg;
          const accountAddress = this.walletAddress;
          const provider = new ethers.JsonRpcProvider(
            'https://polygon-rpc.com'
          );
          let tokenBalance;

          if (token?.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
            const balance = await provider.getBalance(accountAddress);
            tokenBalance = ethers.formatUnits(balance.toString(), 18);
          } else {
            const contract = new ethers.Contract(token?.address, abi, provider);
            const decimals = await contract.decimals();
            const balanceAmount = await contract.balanceOf(accountAddress);
            tokenBalance = ethers.formatUnits(
              balanceAmount.toString(),
              decimals
            );
          }

          const truncatedBalance = tokenBalance.slice(0, 4);

          if (isFrom) {
            this.fromFiat = fiatValue;
            this.fromTokenBalance = truncatedBalance;
            this.fromCalculatedFiat = fiatValue * this.fromTokenQuantity;
          } else {
            this.toFiat = fiatValue;
            this.toTokenBalance = truncatedBalance;
          }

          this.balanceCache[cacheKey] = {
            balance: truncatedBalance,
            fiat: fiatValue,
            calculatedFiat: isFrom ? this.fromCalculatedFiat : undefined,
          };

          this.calculateRatio();
        }
      } catch (error) {
        console.error('Failed to fetch token balance:', error);
      } finally {
        this[loadingFlag] = false;
      }
    },
    sanitizeInput(event, model) {
      let value = event.target.value;
      console.log(value, this.fromTokenQuantity, 'dfffdff');
      if (value === '') {
        this[model] = '';
      } else {
        value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        this[model] = value;
      }
      if (this.selectedFromToken && model === 'fromTokenQuantity') {
        this.updateTokenBalance(this.selectedFromToken, true);
      }

      this.calculateRatio(model === 'fromTokenQuantity' ? 'from' : 'to');
    },
    calculateRatio(origin) {
      if (this.disableRecalculation) return;
      if (
        !this.selectedFromToken ||
        !this.selectedReceiveToken ||
        !this.fromFiat ||
        !this.toFiat
      ) {
        return;
      }

      const input1 = parseFloat(this.fromTokenQuantity) || 0;
      const input2 = parseFloat(this.ratio) || 0;
      let rateFromMsg1 = parseFloat(this.fromFiat) || 0;
      let rateFromMsg2 = parseFloat(this.toFiat) || 0;
      if (this.isSwapped) {
        [rateFromMsg1, rateFromMsg2] = [rateFromMsg2, rateFromMsg1];
      }

      if (origin === 'from' && input1 && rateFromMsg2 !== 0) {
        const result = (input1 * rateFromMsg1) / rateFromMsg2;
        this.ratio = result.toFixed(2);
        this.toCalculatedFiat = (result * rateFromMsg2).toFixed(4);
      } else if (origin === 'to' && !isNaN(input2) && rateFromMsg1 !== 0) {
        const result = (input2 * rateFromMsg2) / rateFromMsg1;
        this.fromTokenQuantity = result.toFixed(2);
      }
    },
    setMaxTokenQuantity() {
      const maxQuantity = parseFloat(this.fromTokenBalance) - 0.01;
      this.fromTokenQuantity = maxQuantity > 0 ? maxQuantity.toFixed(2) : '0';
      this.calculateRatio('from');
    },
    toggleSlippageModal() {
      this.showSlippageModal = !this.showSlippageModal;
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target) && this.showSlippageModal) {
        this.showSlippageModal = false;
      }
    },
    setToCustom() {
      this.selectOption('custom');
    },
    selectOption(option) {
      console.log(option, 'optionoption');
      this.selectedOption = option;
      console.log(this.selectedOption,"sdffddfdf")
      if (option === 'auto') {
        this.slippageType = 'auto';
      } else if (option === 'custom') {
        this.slippageType = 'custom';
      }
    },
    toggleAccordion(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    },
    async getAccountBalance() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // await window.ethereum.request({ method: 'eth_requestAccounts' });
          const networkId = await web3.eth.net.getId();
          this.chainId = Number(networkId);
          // Immediately fetch tokens and set the default token
          await this.fetchAndSetDefaultToken();

          // await this.updateTokenBalance();

          // Listen to chain changes
          ethereum.on('chainChanged', async (chainIdHex) => {
            const id = parseInt(chainIdHex, 16);
            if (this.chainId !== id) {
              this.chainId = id;
              await this.fetchAndSetDefaultToken();
            }
          });
        } catch (error) {
          console.error('Error fetching account balance:', error);
        }
      } else {
        console.log('Please install MetaMask!');
      }
    },

    async fetchAndSetDefaultToken() {
      this.isLoadingTokens = true;
      try {
        await this.$refs.tokenModal.fetchTokens(137);
        this.setDefaultToken();
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        this.isLoadingTokens = false;
      }
    },
    setDefaultToken() {
      const symbolMap = {
        137: 'MATIC',
        1: 'ETH',
        56: 'BNB',
        8453: 'ETH',
        43114: 'AVAX',
      };

      const urlParams = new URLSearchParams(window.location.search);
      const fromToken = urlParams.get('fromToken');
      const toToken = urlParams.get('toToken');
      if (fromToken) {
        return;
      }
      const desiredSymbol = symbolMap[137];
      const defaultToken = Object.values(this.tokens).find(
        (token) => token.symbol === desiredSymbol
      );
      if (defaultToken) {
        this.selectedFromToken = defaultToken;
        this.selectedFromTokenAddress = defaultToken.address;
        this.updateTokenBalance(defaultToken, true);
      }
    },

    updateStateBasedOnChainId() {},

    resetTransactionFields() {
      // this.selectedFromToken = null;
      this.selectedToToken = null;
      this.selectedReceiveToken = null;
      this.fromTokenQuantity = '';
      (this.fromCalculatedFiat = ''), (this.toTokenQuantity = '');
      this.ratio = '';
      this.fromTokenBalance = '';
      this.toTokenBalance = '';
      this.fromFiat = 0;
      this.toFiat = 0;

      this.clearInputField();
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    swapSelections() {
      const temp = this.selectedFromToken;
      this.selectedFromToken = this.selectedToToken;
      this.selectedToToken = temp;
      this.isSwapped = !this.isSwapped;
    },
    swapTokens() {
      this.disableRecalculation = true;

      // Swap the token objects
      const tempFromToken = this.selectedFromToken;
      this.selectedFromToken = this.selectedReceiveToken;
      this.selectedReceiveToken = tempFromToken;

      // Swap the quantities in the input fields
      const tempQuantity = this.fromTokenQuantity;
      this.fromTokenQuantity = this.ratio;
      this.ratio = tempQuantity;

      // Swap the balances related to each token
      const tempBalance = this.fromTokenBalance;
      this.fromTokenBalance = this.toTokenBalance;
      this.toTokenBalance = tempBalance;

      // Swap the calculated fiat values
      const tempCalculatedFiat = this.fromCalculatedFiat;
      this.fromCalculatedFiat = this.toCalculatedFiat;
      this.toCalculatedFiat = tempCalculatedFiat;

      // Swap the fiat conversion rates
      const tempFiat = this.fromFiat;
      this.fromFiat = this.toFiat;
      this.toFiat = tempFiat;

      // Re-enable recalculation
      this.disableRecalculation = false;

      // Force an update to the component to reflect changes
      this.$forceUpdate();
    },
    updateFromCalculatedFiat() {
      this.fromCalculatedFiat = (
        this.fromFiat * parseFloat(this.fromTokenQuantity)
      ).toFixed(2);
    },
    clearInputField() {
      this.fromTokenQuantity = '';
      // Force Vue to update the DOM
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
  },

  computed: {
    hasToTokenParam() {
      return this.getUrlParameter('toToken') !== null;
    },
    isDisabled() {
      return (
        !this.ratio ||
        this.toFiat == 0 ||
        !this.fromTokenQuantity ||
        this.fromTokenQuantity === '0' ||
        parseFloat(this.fromTokenQuantity) >
          parseFloat(this.fromTokenBalance) ||
        this.isTransactionPending
      ); // Disable button if transaction is pending
    },
    buttonText() {
      if (!this.walletAddress) {
        return 'Connect Wallet';
      } else if (this.toFiat == 0 || this.toFiat == '') {
        return 'Select Token';
      } else if (
        !this.fromTokenQuantity ||
        this.fromTokenQuantity === '0' ||
        this.fromTokenQuantity === ''
      ) {
        return 'Enter an Amount';
      } else if (this.fromTokenQuantity >= this.fromTokenBalance) {
        return 'Insufficient balance';
      } else {
        return this.isTransactionPending ? 'Processing...' : 'Swap';
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.getAccountBalance().then(() => {
      this.fetchTokens().then(() => {
        this.setTokenFromParams().then(() => {
          if (!this.initialLoadComplete) {
            this.updateTokenBalance(this.selectedFromToken, true);
            this.updateTokenBalance(this.selectedReceiveToken, false);
            this.initialLoadComplete = true;
          }
        });
      });
    });
  },

  watch: {
    selectedFromToken(newVal, oldVal) {
      if (newVal !== oldVal) this.calculateRatio('from');
    },
    selectedToToken(newVal, oldVal) {
      if (newVal !== oldVal) this.calculateRatio('from');
    },
    fromFiat(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.updateFromCalculatedFiat();
      }
    },
    toFiat(newVal) {
      this.calculateRatio('from');
    },
    fromTokenQuantity(newVal, oldVal) {
      if (newVal !== oldVal && newVal > 0) {
        this.updateFromCalculatedFiat();
      }
    },
    hash(newVal) {
      if (newVal) {
        this.resetTransactionFields();
        console.log(this.fromTokenQuantity, 'fdcffdf');
        if (this.selectedFromToken) {
          this.updateTokenBalance(this.selectedFromToken, true);
        }
        const Msg = 'Transaction succesfully';
        notification.notify({
          text: Msg,
          type: 'success',
          duration: 2000,
          speed: 1000,
        });
      }
    },
    error(newVal) {
      if (newVal) {
        console.log(newVal.TransactionExecutionError, 'newVal');
        const Msg = 'User reject the request';
        notification.notify({
          text: Msg,
          type: 'warn',
          duration: 2000,
          speed: 1000,
        });
      }
    },
  },
};
</script>


<style>
.error-modal {
  position: fixed;
  background: rgba(0, 0, 0, 0.4);
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.error-modal .modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 460px;
  border: 0;
  border-radius: 10px;
  padding: 25px;
  text-align: center;
}
.error-modal .modal-content button {
  background: #28a5ff;
  color: #fff;
  border: 0;
  padding: 7px 20px;
  display: flex;
  border-radius: 4px;
  font-size: 14px;
  width: auto !important;
  max-width: 100px;
  justify-content: center;
  margin: 0 auto;
}
</style>
