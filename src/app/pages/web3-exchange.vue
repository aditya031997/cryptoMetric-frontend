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
                        v-model="slippageValue"
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
        <!-- <p
          class="pay-content"
          v-if="fromTokenQuantity > 0 && fromCalculatedFiat"
        >
          ${{ fromCalculatedFiat }}
        </p> -->
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
        <div class="right-side-balance-box mt-1">
          Balance: {{ fromTokenBalance ? fromTokenBalance : 0 }}
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
        <div v-if="isLoadingQuotation">Fetching quotation...</div>
        <div v-else>
          <input
            v-model="ratio"
            type="text"
            min="0"
            placeholder="0"
            @input="sanitizeInput($event, 'ratio')"
            class="form-control number-input"
          />
        </div>

        <!-- <p
          class="pay-content"
          v-if="ratio"
        >
          ${{ toCalculatedFiat }}
        </p> -->
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
import { reactive, toRefs, ref, watch } from 'vue';
import { mapGetters } from 'vuex';

import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from '@wagmi/vue';
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

const rpcUrls = {
  137: 'https://site1.moralis-nodes.com/polygon/0cb949e1d801432f9e58f3fd2686140b',
  56: 'https://bsc-rpc.publicnode.com',
  1: 'https://ethereum-rpc.publicnode.com',
  8453: 'https://base.drpc.org',
  43114: 'https://avax.meowrpc.com',
};

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
      walletAddress: localStorage.getItem('walletAddress'),
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
      isLoadingQuotation: false,
      quotationResponse: null,
      selectedToken: {},
      fromTokenQuantity: '',
      fromTokenBalance: '',
      balanceCache: {},
      toTokenBalance: '',
      chainId: '',
      networkId: '',
      fromFiat: 0,
      toFiat: 0,
      balance: '0',
      fromCalculatedFiat: '',
      toCalculatedFiat: '',
      selectedFromTokenAddress: '',
      selectedToTokenAddress: '',
      ratio: '',
      isSwapped: false,
      quotationValue: '',
      showSlippageModal: false,
      slippageValue: 0.5,
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
    const { isConnected } = useAccount();
    const { address } = useAccount();
    console.log(address, isConnected, 'addressaddress');
    const {
      data: hash,
      error,
      isPending,
      sendTransaction,
    } = useSendTransaction();

    let state = reactive({
      isTransactionPending: false,
      netWorkId: address._object.chainId,
      selectedFromTokenAddress: '',
      selectedToTokenAddress: '',
      fromTokenQuantity: '',
      walletAddress: isConnected._object.address,
      quotationResponse: null,
    });

    const sendTrans = async () => {
      state.isTransactionPending = isPending;
      const web3 = new Web3(window.ethereum);

      try {
        const fromTokenQuantityWei = web3.utils.toWei(
          state.fromTokenQuantity.toString(),
          'ether'
        );

        const allowanceResponse = await axios.get(
          `http://localhost:5000/tokens/allowances`,
          {
            params: {
              tokenAddress: state.selectedFromTokenAddress,
              walletAddress: state.walletAddress,
              chain: state.netWorkId,
            },
          }
        );
        const allowance = BigInt(allowanceResponse.data);
        const requiredAmount = BigInt(fromTokenQuantityWei);

        if (allowance < requiredAmount) {
          const approveResult = await axios.get(
            `http://localhost:5000/tokens/approve`,
            {
              params: {
                tokenAddress: state.selectedFromTokenAddress,
                value: fromTokenQuantityWei,
                chain: state.netWorkId,
              },
            }
          );
          await sendTransaction({
            from: state.walletAddress,
            to: approveResult.data.to,
            data: approveResult.data.data,
          });
        }
      } catch (error) {
        console.error('Error during approval:', error);
      } finally {
        try {
          await sendTransaction({
            from: state.walletAddress,
            to: state.quotationResponse.to,
            data: state.quotationResponse.data,
            value: state.quotationResponse.value,
            gasPrice: state.quotationResponse.gasPrice,
            chainId: state.netWorkId,
          });
        } catch (error) {
          console.error('Error sending transaction:', error);
        } finally {
          state.isTransactionPending = false;
        }
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
      const chainId = this.getChainId ?? this.netWorkId ?? 1;
      console.log(chainId, 'chainId333');
      try {
        const response = await axios.get(
          `http://localhost:5000/tokens/getTokensToSwapByChainId?chain=${chainId}`
        );
        console.log(response, 'response1');
        this.fetchedData = response.data;
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
      const chainId = this.getChainId ?? this.netWorkId;

      console.log(isFrom, 'chainIdchainId');

      try {
        if (token?.address) {
          const response = await axios.get(
            `http://localhost:5000/tokens/fetchBalance?tokenAddress=${token?.address}&walletAddress=${this.walletAddress}&chain=${chainId}`
          );
          console.log(response, 'response');
          const fiatValue = response.data;
          const accountAddress = this.walletAddress;
          const provider = new ethers.JsonRpcProvider(rpcUrls[chainId]);
          let tokenBalance;
          if (token?.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
            const balance = await provider.getBalance(accountAddress);
            tokenBalance = ethers.formatUnits(balance.toString(), 18);
            console.log(tokenBalance, 'tokenBalance');
          } else {
            const contract = new ethers.Contract(token?.address, abi, provider);
            const decimals = await contract.decimals();
            const balanceAmount = await contract.balanceOf(accountAddress);
            tokenBalance = ethers.formatUnits(
              balanceAmount.toString(),
              decimals
            );
          }

          const truncatedBalance = tokenBalance.slice(0, 6);

          if (isFrom) {
            this.fromFiat = fiatValue;
            this.fromTokenBalance = Number(
              parseFloat(response.data).toFixed(4)
            );
            this.fromCalculatedFiat = fiatValue * this.fromTokenQuantity;
          } else {
            this.toFiat = fiatValue;
            this.toTokenBalance = truncatedBalance;
          }

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
    async calculateRatio(origin) {
      if (this.disableRecalculation) return;
      if (
        !this.selectedFromToken ||
        !this.selectedReceiveToken ||
        !this.fromFiat ||
        !this.toFiat
      ) {
        return;
      }
      this.isLoadingQuotation = true;
      const quotationData = {
        fromTokenObj: {
          address: this.selectedFromToken.address,
          decimals: this.selectedFromToken.decimals,
          symbol: this.selectedFromToken.symbol,
          name: this.selectedFromToken.name,
        },
        toTokenObj: {
          address: this.selectedReceiveToken.address,
          decimals: this.selectedReceiveToken.decimals,
          symbol: this.selectedReceiveToken.symbol,
          name: this.selectedReceiveToken.name,
        },

        walletAddress: this.walletAddress,
        chain: this.netWorkId,
        amountIn: this.fromTokenQuantity,
        slippageTolerance: this.slippageValue,
      };
      try {
        const fetchQuotation = await axios.post(
          `http://localhost:5000/tokens/buildSwapTx`,
          quotationData
        );
        this.quotationResponse = fetchQuotation.data;
        const input1 = parseFloat(this.fromTokenQuantity) || 0;
        const input2 = parseFloat(this.ratio) || 0;
        let rateFromMsg1 = parseFloat(this.fromFiat) || 0;
        let rateFromMsg2 = parseFloat(this.toFiat) || 0;
        if (this.isSwapped) {
          [rateFromMsg1, rateFromMsg2] = [rateFromMsg2, rateFromMsg1];
        }
        let formatedQuotation;
        const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
        if (
          quotationData.toTokenObj.address ==
          '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        ) {
          const fetchedQuotation = ethers.formatEther(
            fetchQuotation.data.amountOut.toString()
          );
          formatedQuotation = fetchedQuotation.data.amountOut.toFixed(8);
        } else {
          const tokenInstance = new ethers.Contract(
            quotationData.toTokenObj.address,
            abi,
            provider
          );
          formatedQuotation = fetchQuotation.data.amountOut.toString();
        }
        if (origin === 'from' && input1 && rateFromMsg2 !== 0) {
          const result = (input1 * rateFromMsg1) / rateFromMsg2;
          console.log(formatedQuotation, 'formatedQuotation');
          this.ratio = formatedQuotation;
          this.toCalculatedFiat = (result * rateFromMsg2).toFixed(4);
        } else if (origin === 'to' && !isNaN(input2) && rateFromMsg1 !== 0) {
          const result = (input2 * rateFromMsg2) / rateFromMsg1;
          this.fromTokenQuantity = result.toFixed(2);
        }
      } catch (error) {
        console.error('Error fetching quotation:', error);
      } finally {
        this.isLoadingQuotation = false;
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
          const networkId = await web3.eth.net.getId();
          this.chainId = Number(networkId);
          await this.fetchAndSetDefaultToken();
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
        const chainId = this.getChainId ?? this.netWorkId;
        await this.$refs.tokenModal.fetchTokens(chainId);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await this.fetchTokens(chainId);
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
      const chainId = this.getChainId ?? this.netWorkId ?? 1;
      const desiredSymbol = symbolMap[chainId];
      const defaultToken = this.fetchedData.find(
        (token) => token.symbol === desiredSymbol
      );
      console.log(defaultToken, 'defaultToken');
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
      this.fromCalculatedFiat = '';
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

    swapTokens() {
      // Temporarily disable recalculation to avoid unnecessary computations during the swap
      this.disableRecalculation = true;

      // Swap the selected tokens and their addresses
      [this.selectedFromToken, this.selectedReceiveToken] = [
        this.selectedReceiveToken,
        this.selectedFromToken,
      ];
      [this.selectedFromTokenAddress, this.selectedToTokenAddress] = [
        this.selectedToTokenAddress,
        this.selectedFromTokenAddress,
      ];

      // Swap the input quantities
      [this.fromTokenQuantity, this.ratio] = [
        this.ratio,
        this.fromTokenQuantity,
      ];

      // Swap the token balances
      [this.fromTokenBalance, this.toTokenBalance] = [
        this.toTokenBalance,
        this.fromTokenBalance,
      ];

      // Swap the fiat values
      [this.fromFiat, this.toFiat] = [this.toFiat, this.fromFiat];

      // Recalculate the fiat values based on the new token quantities
      this.fromCalculatedFiat = (
        this.fromFiat * parseFloat(this.fromTokenQuantity)
      ).toFixed(2);
      this.toCalculatedFiat = (this.toFiat * parseFloat(this.ratio)).toFixed(2);

      // Re-enable recalculation
      this.disableRecalculation = false;

      // Update the display without calling the API
      this.$nextTick(() => {
        this.updateFromCalculatedFiat();
        this.calculateRatio('from');
      });

      // Force a component update to reflect the changes
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
    async initializeData() {
      document.addEventListener('click', this.handleClickOutside);
      this.getAccountBalance().then(() => {
        if (this.isConnected) {
          this.fetchTokens().then(() => {
            this.setTokenFromParams().then(() => {
              if (!this.initialLoadComplete) {
                this.updateTokenBalance(this.selectedFromToken, true);
                this.updateTokenBalance(this.selectedReceiveToken, false);
                this.initialLoadComplete = true;
              }
              this.setDefaultToken();
            });
          });
        }
      });
    },
  },

  computed: {
    ...mapGetters(['getChainId']),

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
      if (!this.isConnected) {
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
    this.initializeData();
  },
  watch: {
    isConnected(newVal) {
      console.log(newVal, 'newVal');
      if (newVal) {
        this.initializeData();
      }
    },
    getChainId(newChainId) {
      this.fetchTokens().then(() => {
        this.setDefaultToken();
      });
    },
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
        // this.resetTransactionFields();
        // this.resetState();
        const Msg = 'Transaction successfully';
        notification.notify({
          text: Msg,
          type: 'success',
          duration: 2000,
          speed: 1000,
        });

        // Delay the API call by 2 seconds
        setTimeout(async () => {
          try {
            const chainId = this.getChainId ?? this.netWorkId;
            const response = await axios.get(
              `http://localhost:5000/tokens/fetchBalance?tokenAddress=${this.selectedFromToken.address}&walletAddress=${this.walletAddress}&chain=${chainId}`
            );
            this.fromTokenBalance = Number(
              parseFloat(response.data).toFixed(4)
            );
            console.log(this.fromTokenBalance, 'ysuyfusuvyv');
          } catch (error) {
            console.error('Error fetching balance:', error);
          }
        }, 2000);
        // window.location.reload()
      }
    },
    error(newVal) {
      if (newVal) {
        const errorMessage = newVal.message
          ? newVal.message
          : 'No message available';
        const userRejectedMessage = 'User rejected the request';
        const isUserRejected = errorMessage.includes(userRejectedMessage);
        const Msg = isUserRejected ? userRejectedMessage : 'An error occurred';
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
