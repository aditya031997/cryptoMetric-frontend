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
                    <!-- {{ item.title }} -->
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
          <button @click="setMaxTokenQuantity">max</button>
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
          <span v-if="!selectedReceiveToken">Select Token</span>
          <span
            v-else
            class="swap-list"
          >
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
    <button
      class="modal-button connect-wallet btn"
      @click="handleTrade"
      :disabled="isDisabled"
    >
      {{ buttonText }}
    </button>
    <!-- In your component template -->
    <TokenModal
      ref="tokenModal"
      :is-visible="isSwapModalVisible"
      :chain-id="chainId"
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
import axios from 'axios';
import Cookies from 'js-cookie';
import Web3 from 'web3';
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
      slippage: 0.5,
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
          `${configs.NODE_API_URL}/tokens/swager?chain=${this.chainId}`
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
          this.selectedFromTokenAddress = fromToken.address;
          this.updateTokenBalance(fromToken, true);
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
        const toToken = Object.values(this.fetchedData).find(
          (token) => token.symbol === toTokenSymbol
        );
        if (toToken) {
          this.selectedReceiveToken = toToken;
          this.selectedToTokenAddress = toToken.address;
          this.updateTokenBalance(toToken, false);
          toTokenSet = true;
        }else {
          this.showErrorModal(
            'Token does not exist on this chain ID. Please change the chain ID.'
          );
          this.selectedToken = null;
          this.selectedToTokenAddress = '';
        }
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
      console.log('Received chainId:', chainId);
      if (chainId) {
        this.setTokenFromParams();
      }
    },
    handleTokenSelected(token) {
      if (this.isSelectingFrom) {
        this.selectedFromToken = token;
        this.selectedFromTokenAddress = token.address;
        this.updateTokenBalance(token, true);
      } else {
        this.selectedReceiveToken = token;
        this.selectedToTokenAddress = token.address;
        this.updateTokenBalance(token, false);
      }
      this.isSwapModalVisible = false;
    },
    async updateTokenBalance(token, isFrom) {
      // Choose the appropriate loading flag
      let loadingFlag = isFrom ? 'isLoadingFromBalance' : 'isLoadingToBalance';

      // Check the cache for existing balances
      const cacheKey = token.address + (isFrom ? '_from' : '_to');
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

      // Prevent concurrent updates for this field
      if (this[loadingFlag]) {
        console.log('Update in progress, skipping new request');
        return;
      }

      this[loadingFlag] = true;

      try {
        // Simulate a small delay before fetching the balance
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Fetch fiat value data from your API
        const response = await axios.get(
          `${configs.NODE_API_URL}/tokens/convert?chain=${this.chainId}&addresses=${token.address}`
        );
        const fiatValue = response.data.msg;

        const web3 = new Web3(window.ethereum);
        const account = (await web3.eth.getAccounts())[0];
        const provider = new ethers.BrowserProvider(window.ethereum);

        let tokenBalance;

        if (token.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
          // Handle native cryptocurrency (e.g., Ether)
          const signer = await provider.getSigner();
          const balance = await provider.getBalance(signer.address);
          tokenBalance = ethers.formatUnits(balance.toString(), 18);
        } else {
          // Handle ERC-20 token balance
          const contract = new ethers.Contract(token.address, abi, provider);
          const decimals = await contract.decimals();
          const balanceAmount = await contract.balanceOf(account);
          tokenBalance = ethers.formatUnits(balanceAmount.toString(), decimals);
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

        // Cache the fetched balance and calculated values
        this.balanceCache[cacheKey] = {
          balance: truncatedBalance,
          fiat: fiatValue,
          calculatedFiat: isFrom ? this.fromCalculatedFiat : undefined,
        };

        this.calculateRatio();
      } catch (error) {
        console.error('Failed to fetch token balance:', error);
      } finally {
        this[loadingFlag] = false; // Release the loading flag
      }
    },
    sanitizeInput(event, model) {
      let value = event.target.value;
      value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

      this[model] = value;
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

      if (origin === 'from' && !isNaN(input1) && rateFromMsg2 !== 0) {
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
      this.selectedOption = option;
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
          await window.ethereum.request({ method: 'eth_requestAccounts' });
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
        await this.$refs.tokenModal.fetchTokens(this.chainId);
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
      const desiredSymbol = symbolMap[this.chainId.toString()];
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
    async handleTrade() {
      this.isTransactionPending = true;
      const slippageValue =
        this.selectedOption === 'auto' ? 0.5 : this.customSlippage;
      const web3 = new Web3(window.ethereum);
      const savedAccount = await web3.eth.getAccounts();
      try {
        const allowanceResponse = await axios.get(
          `${configs.NODE_API_URL}/tokens/allowance`,
          {
            params: {
              tokenAddress: `${this.selectedFromTokenAddress}`,
              walletAddress: `${savedAccount}`,
              chain: `${this.chainId}`,
            },
          }
        );
        const allowance = allowanceResponse.data.allowance;
        setTimeout(async () => {
          let swapData;

          if (allowance === '0') {
            const approve = await axios.get(
              `${configs.NODE_API_URL}/tokens/approveTransaction?tokenAddress=${this.selectedFromTokenAddress}&chain=${this.chainId}`
            );
          }

          swapData = {
            slippage: slippageValue,
            src: this.selectedFromTokenAddress,
            from: savedAccount[0],
            dst: this.selectedToTokenAddress,
            chain: this.chainId,
            amount: web3.utils.toWei(
              this.fromTokenQuantity.toString(),
              'ether'
            ),
          };
          const swap = await axios.post(
            `${configs.NODE_API_URL}/tokens/swapper`,
            swapData
          );

          if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
              await window.ethereum.request({ method: 'eth_requestAccounts' });

              const accounts = await web3.eth.getAccounts();
              const senderAddress = accounts[0];

              // Transaction details
              const transaction = {
                from: senderAddress,
                to: swap.data.tx.to,
                value: swap.data.tx.value,
                data: swap.data.tx.data,
                gas: swap.data.tx.gas,
                gasPrice: swap.data.tx.gasPrice,
              };

              // Send transaction
              const txHash = await web3.eth.sendTransaction(transaction);
              // console.log(txHash, 'txHash');
              if (txHash) {
                notification.notify({
                  title: 'Sucsess',
                  text: 'Transaction Successfull',
                  type: 'success',
                  duration: 2000,
                  speed: 1000,
                });
                this.isTransactionPending = false;
                this.resetTransactionFields();
                this.setDefaultToken(); // Set default token after transaction
                this.updateTokenBalance(this.selectedFromToken, true); // Update balance
              }
            } catch (error) {
              this.isTransactionPending = false;
              const errorMsg = 'User denied transaction';
              console.error('Error sending transaction:', error);
              notification.notify({
                title: 'Denied',
                text: errorMsg,
                type: 'warn',
                duration: 2000,
                speed: 1000,
              });
            }
          } else {
            alert('Please install MetaMask to use this feature.');
          }
        }, 1000);
      } catch (err) {
        console.error(err);
        alert('Swap error.');
      }
    },
    resetTransactionFields() {
      this.selectedFromToken = null;
      this.selectedToToken = null;
      this.selectedReceiveToken = null;
      this.fromTokenQuantity = '';
      this.toTokenQuantity = '';
      this.ratio = '';
      this.fromTokenBalance = '';
      this.toTokenBalance = '';
      this.fromFiat = 0;
      this.toFiat = 0;
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
  },

  computed: {
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
      if (this.toFiat == 0 || this.toFiat == '') {
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
        this.setTokenFromParams();
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
