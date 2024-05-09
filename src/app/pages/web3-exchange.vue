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
          v-if="fromCalculatedFiat > 0"
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
          v-if="fromFiat != 0 || fromFiat != ''"
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
          ${{ ratio }}
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
    />
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
      selectedFromToken: null,
      selectedReceiveToken: null,
      isSwapModalVisible: false,
      isLoadingTokens: false,
      isLoadingBalances: false,
      selectedToken: {},
      fromTokenQuantity: '',
      toTokenQuantity: '',
      fromTokenBalance: '',
      toTokenBalance: '',
      chainId: '',
      fromFiat: 0,
      toFiat: 0,
      balance: '0',
      fromCalculatedFiat: '',
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
    handleSelectFrom() {
      this.isSelectingFrom = true;
    },
    handleSelectTo() {
      this.isSelectingFrom = false;
    },
    // In your methods
    handleTokensFetched(tokens) {
      this.tokens = tokens;
      this.setDefaultToken();
    },
    handleTokenSelected(token) {
      if (this.isSelectingFrom) {
        this.selectedFromToken = token;
        this.updateTokenBalance(token, true);
      } else {
        this.selectedReceiveToken = token;
        this.updateTokenBalance(token, false);
      }
      this.isSwapModalVisible = false;
    },
    async updateTokenBalance(token, isFrom) {
      if (this.isLoadingBalances) {
        console.log('Update in progress, skipping new request');
        return;
      }
      this.isLoadingBalances = true;

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await axios.get(
          `${configs.LOCAL_API_URL}/tokens/convert?chain=${this.chainId}&addresses=${token.address}`
        );
        const web3 = new Web3(window.ethereum);
        const account = (await web3.eth.getAccounts())[0];
        const provider = new ethers.BrowserProvider(window.ethereum);

        let tokenBalance;
        if (token.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
          console.log('here');
          const signer = await provider.getSigner();
          const balance = await provider.getBalance(signer.address);
          tokenBalance = ethers.formatUnits(balance.toString(), 18);
        } else {
          console.log('there');

          // Handle ERC-20 token
          const contract = new ethers.Contract(token.address, abi, provider);
          const decimals = await contract.decimals();
          const balanceAmount = await contract.balanceOf(account);
          tokenBalance = ethers.formatUnits(balanceAmount.toString(), decimals);
        }

        const first4Chars = tokenBalance.slice(0, 4);

        if (isFrom) {
          this.fromFiat = response.data.msg;
          this.fromTokenBalance = first4Chars;
          this.fromCalculatedFiat = response.data.msg * this.fromTokenQuantity;
        } else {
          this.toFiat = response.data.msg;
          this.toTokenBalance = first4Chars;
        }

        this.calculateRatio();
      } catch (error) {
        console.error('Failed to fetch token balance:', error);
      } finally {
        this.isLoadingBalances = false;
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
      console.log('Selected from token:', this.selectedFromToken);
      console.log('Selected receive token:', this.selectedReceiveToken);
      console.log('Message 1:', this.fromFiat);
      console.log('Message 2:', this.toFiat);
      if (
        !this.selectedFromToken ||
        !this.selectedReceiveToken ||
        !this.fromFiat ||
        !this.toFiat
      ) {
        console.log('Missing data for calculation');
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
      };
      const desiredSymbol = symbolMap[this.chainId.toString()];
      const defaultToken = Object.values(this.tokens).find(
        (token) => token.symbol === desiredSymbol
      );

      if (defaultToken) {
        this.selectedFromToken = defaultToken;
        this.updateTokenBalance(defaultToken, true);
      }
    },

    updateStateBasedOnChainId() {
      console.log(this.chainId, 'Chain ID');
    },
    async handleTrade() {
      this.isTransactionPending = true;
      const slippageValue =
        this.selectedOption === 'auto' ? 0.5 : this.customSlippage;
      const web3 = new Web3(window.ethereum);
      const savedAccount = await web3.eth.getAccounts();
      const tokenone = Cookies.get('tokenone');
      const tokentwo = Cookies.get('tokentwo');
      try {
        const allowanceResponse = await axios.get(
          `${configs.LOCAL_API_URL}/tokens/allowance`,
          {
            params: {
              tokenAddress: `${tokenone}`,
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
              `${configs.LOCAL_API_URL}/tokens/approveTransaction?tokenAddress=${tokenone}&chain=${this.chainId}`
            );
          }
          if (this.slippageType === 'auto') {
          } else if (this.slippageType === 'custom') {
          }

          swapData = {
            slippage: slippageValue,
            src: tokenone,
            from: savedAccount[0],
            dst: tokentwo,
            chain: this.chainId,
            amount: web3.utils.toWei(
              this.fromTokenQuantity.toString(),
              'ether'
            ),
          };
          const swap = await axios.post(
            `${configs.LOCAL_API_URL}/tokens/swapper`,
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
              console.log(transaction, 'transaction');
              // Send transaction
              const txHash = await web3.eth.sendTransaction(transaction);
              console.log(txHash, 'txHash');
              if (txHash) {
                this.isTransactionPending = false;
                this.resetTransactionFields();
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
              4;
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
      // this.fetchTokenData();
    },
    swapTokens() {
      const tempFromToken = this.selectedFromToken;
      const tempToToken = this.selectedReceiveToken;
      const tempQuantity1 = this.fromTokenQuantity;
      const tempRatio = this.ratio;

      // Swap the tokens
      this.selectedFromToken = tempToToken;
      this.selectedReceiveToken = tempFromToken;

      // Swap the input values
      this.fromTokenQuantity = tempRatio;
      this.ratio = tempQuantity1;

      this.isSwapped = !this.isSwapped;
      this.calculateRatio('from');
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
  async mounted() {
    document.addEventListener('click', this.handleClickOutside);
    await this.getAccountBalance().then((balance) => {
      this.balance = balance;
    });
  },
  watch: {
    selectedFromToken(newVal, oldVal) {
      if (newVal !== oldVal) this.calculateRatio('from');
    },
    selectedToToken(newVal, oldVal) {
      if (newVal !== oldVal) this.calculateRatio('from');
    },
    fromFiat(newVal) {
      this.calculateRatio('from');
    },
    toFiat(newVal) {
      this.calculateRatio('from');
    },
    fromTokenQuantity(newVal) {
      if (newVal) this.calculateRatio('from');
    },
  },
};
</script>

<style>
</style>
