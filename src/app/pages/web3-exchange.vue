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

        <div
          v-if="isLoadingFromQuotation"
          class="spinner-border spinner-border-sm text-info ml-2"
          role="status"
        >
          <span class="sr-only">Loading...</span>
        </div>

        <!-- <div v-if="isLoadingFromQuotation">Fetching quotation...</div> -->
        <div v-else>
          <input
            ref="fromTokenQuantityInput"
            v-model="fromTokenQuantity"
            type="text"
            min="0"
            placeholder="0"
            @input="debouncedSanitizeInput($event, 'fromTokenQuantity')"
            class="form-control number-input"
          />
        </div>

        <!-- <p
          class="pay-content"
          v-if="fromTokenQuantity > 0 && fromCalculatedFiat"
        >
          ${{ fromCalculatedFiat }}
        </p> -->
      </div>

      <div>
        <div v-if="isLoadingTokens || isLoadingBalances">Loading tokens...</div>
        <div
          v-else
          class="right-side-input-css"
        >
          <button
            class="token-btn"
            :class="{ 'disabled-button': isCalculatingRatio }"
            @click="handleSelectFrom()"
          >
            <span class="swap-list">
              <img
                v-if="selectedFromToken && selectedFromToken.logoURI"
                :src="selectedFromToken?.logoURI || defaultImage"
                :alt="selectedFromToken?.symbol"
                class="token-logo"
                @error="handleImageError($event, selectedFromToken.symbol)"
              />
              <span>{{ selectedFromToken?.symbol }}</span>
            </span>
            <span> <dropdownIcon /></span>
          </button>

          <div
            v-if="(selectedFromToken && fromTokenBalance !== '') || !isConnected"
            class="right-side-balance-box mt-1"
          >
            Balance: {{ fromTokenBalance ? fromTokenBalance : 0 }}
          </div>
          <div
            class="mt-1"
            v-else-if="selectedFromToken && fromTokenBalance === ''"
          >
            Fetching Balance...
          </div>
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
        <!-- <div v-if="isLoadingQuotation">Fetching quotation...</div> -->
        <div
          v-if="isLoadingQuotation"
          class="spinner-border spinner-border-sm text-info ml-2"
          role="status"
        >
          <span class="sr-only">Loading...</span>
        </div>
        <div v-else>
          <input
            v-model="ratio"
            type="text"
            min="0"
            placeholder="0"
            @input="debouncedSanitizeInput($event, 'ratio')"
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
            @click="handleSelectTo()"
            :class="{
              'select-token-btn': true,
              selected: !!selectedReceiveToken,
              'disabled-button': isCalculatingRatio,
            }"
          >
            <span v-if="!selectedReceiveToken && !hasToTokenParam">Select Token</span>
            <span
              v-else
              class="swap-list"
            >
              <img
                :src="selectedReceiveToken?.logoURI"
                :alt="selectedReceiveToken?.symbol"
                class="token-logo"
                @error="handleImageError($event, selectedFromToken.symbol)"
              />
              <span>{{ selectedReceiveToken?.symbol }}</span>
            </span>
            <dropdownIcon />
          </button>
          <p
            class="mt-1"
            v-if="!isConnected && selectedReceiveToken"
          >
            Balance: 0
          </p>
          <p
            class="mt-1"
            v-else-if="(toFiat != 0 || toFiat != '') && selectedReceiveToken && isConnected"
          >
            Balance: {{ toTokenBalance || 0 }}
          </p>
          <p
            class="mt-1"
            v-else-if="(toFiat == 0 && selectedReceiveToken) || (toTokenBalance === '' && selectedReceiveToken)"
          >
            Fetching Balance...
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
    <!-- <div v-if="hash">Transaction Hash: {{ hash }}</div> -->
    <!-- In your component template -->
    <TokenModal
      ref="tokenModal"
      :is-visible="isSwapModalVisible"
      :chain-id="137"
      :fromToken="selectedFromToken"
      :toToken="selectedReceiveToken"
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
import { reactive, toRefs, ref, watch, computed } from 'vue';
import { mapGetters } from 'vuex';

import { useAccount, useChainId, useSendTransaction, useWaitForTransactionReceipt } from '@wagmi/vue';
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
import { useNotification } from '@kyvg/vue3-notification';
import configs from '../../configs/configs';
import _defaultImage from '../assets/images/default-token.png';
import { debounce } from '../utils/helpers/debounce';

const notification = useNotification();
const abi = [
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function balanceOf(address a) view returns (uint)',
];

const rpcUrls = {
  137: 'https://site1.moralis-nodes.com/polygon/8b4fb5cb45d14446a9a0348cc08274e9',
  56: 'https://site1.moralis-nodes.com/bsc/984bbee2a2ee4aafbed34ee755910f0e',
  1: 'https://site1.moralis-nodes.com/eth/02b906dd2ce242bba445b6e6477cb824',
  8453: 'https://site1.moralis-nodes.com/base/7a1036f6fbdd434a839ec2b35771e941',
  43114: 'https://site1.moralis-nodes.com/avalanche/43d7dfdaa10c4428a5392f07f6814a86',
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
      isLoadingFromQuotation: false,
      quotationResponse: null,
      selectedToken: {},
      fromTokenQuantity: '',
      fromTokenBalance: '',
      balanceCache: {},
      toTokenBalance: '',
      chainId: '',
      networkId: '',
      // fromFiat: 0,
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
      allowanceResponse: '',
      slippageType: 'auto',
      selectedOption: 'auto',
      activeIndex: null,
      defaultImage: _defaultImage,
      isCalculatingRatio: false,
      accordionItems: [
        {
          title: 'Section 1',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
      ],
    };
  },

  setup() {
    const { isConnected, address } = useAccount();
    const lastSelectedChainId = useChainId();

    const formattedAddress = computed(() => {
      if (!address.value) return null;
      return address.value;
    });
    const { data: hash, error, isPending, sendTransaction } = useSendTransaction();
    let state = ref({
      isTransactionPending: false,
      netWorkId: address._object.chainId,
      selectedFromTokenAddress: '',
      allowanceResponse: '',
      fromTokenQuantity: '',
      walletAddress: isConnected._object.address,
      quotationResponse: null,
    });
    const setQuotationResponse = (val) => {
      state.quotationResponse = val;
    };
    const setTokenQuantity = (val) => {
      state.fromTokenQuantity = val;
    };
    const setTokenAddress = (val) => {
      state.selectedFromTokenAddress = val;
    };
    const setTokenAllowance = (val) => {
      state.allowanceResponse = val;
    };
    const sendTrans = async () => {
      state.isTransactionPending = isPending;
      const web3 = new Web3(window.ethereum);
      const chain = parseInt(localStorage.getItem('chainId'));
      const wAddre = localStorage.getItem('walletAddress');
      try {
        const fromTokenQuantityWei = web3.utils.toWei(
          state?.fromTokenQuantity?.toString(),
          state.selectedFromTokenAddress.decimals
        );
        const allowance = BigInt(state.allowanceResponse?.data);
        const requiredAmount = BigInt(fromTokenQuantityWei);

        if (allowance < requiredAmount) {
          let approvalValue;
          if (allowance === 0) {
            approvalValue = requiredAmount;
          } else {
            approvalValue = allowance - requiredAmount;
          }
          const approveResult = await axios.get(`${configs.NODE_API_URL}/tokens/grantApproval`, {
            params: {
              tokenAddress: state.selectedFromTokenAddress.address,
              value: fromTokenQuantityWei,
              chain: chain,
            },
          });
          await sendTransaction({
            from: wAddre,
            to: approveResult?.data?.to,
            data: approveResult?.data?.data,
          });
        }
        await sendTransaction({
          from: wAddre,
          to: state.quotationResponse?.to,
          data: state.quotationResponse?.data,
          value: state.quotationResponse?.value,
          gasPrice: state.quotationResponse?.gasPrice,
          chainId: chain,
        });
      } catch (error) {
        console.error(error);
      } finally {
        state.isTransactionPending = false;
      }
    };

    const resetState = () => {
      state.value = {
        fromTokenQuantity: '',
        quotationResponse: '',
        selectedFromTokenAddress: '',
        allowanceResponse: '',
      };
    };

    const UpdateState = (newVal) => {
      state.fromTokenQuantity = newVal;
    };
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
      hash,
    });
    return {
      ...toRefs(state),
      hash,
      error,
      isPending,
      sendTrans,
      isConnected,
      resetState,
      lastSelectedChainId,
      UpdateState,
      setQuotationResponse,
      setTokenQuantity,
      setTokenAddress,
      setTokenAllowance,
      formattedAddress,
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
      if (!this.isCalculatingRatio) {
        this.isSwapModalVisible = true;
        this.isSelectingFrom = true;
      }
    },
    handleSelectTo() {
      if (!this.isCalculatingRatio) {
        this.isSwapModalVisible = true;
        this.isSelectingFrom = false;
      }
    },
    getUrlParameter(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    },
    handleImageError(event, slug) {
      event.target.src = this.defaultImage;
    },
    async fetchTokens() {
      this.isLoadingTokens = true;
      const chainId = parseInt(localStorage.getItem('chainId')) || this.lastSelectedChainId || configs.DEFAULT_CHAIN_ID;
      try {
        const response = await axios.get(`${configs.NODE_API_URL}/tokens/getTokensToSwapByChainId?chain=${chainId}`);
        this.fetchedData = response.data;
        await this.$refs.tokenModal.fetchTokens(chainId);
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
        const fromToken = Object.values(this.tokens).find((token) => token.symbol === fromTokenSymbol);
        if (fromToken) {
          this.selectedFromToken = fromToken;
          this.selectedFromTokenAddress = fromToken?.address;
          this.setTokenAddress(fromToken);
          await this.updateTokenBalance(fromToken, true);
          fromTokenSet = true;
        } else {
          this.showErrorModal('Token does not exist on this chain ID. Please change the chain ID.');
          this.setDefaultToken();
          // this.selectedFromToken = null;
          // this.selectedFromTokenAddress = '';
        }
      }
      if (toTokenSymbol) {
        this.isFetchingToToken = true;
        const toToken = Object.values(this.tokens).find((token) => token.symbol === toTokenSymbol);
        if (toToken) {
          this.selectedReceiveToken = toToken;
          this.selectedToTokenAddress = toToken?.address;
          await this.updateTokenBalance(toToken, false);
          toTokenSet = true;
        } else {
          this.showErrorModal('Token does not exist on this chain ID. Please change the chain ID.');
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
        this.setTokenAddress(token);
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
      if (isFrom) {
        this.fromTokenBalance = '';
      } else {
        this.toTokenBalance = '';
        this.toFiat = '';
      }
      const chainId = parseInt(localStorage.getItem('chainId')) || configs.DEFAULT_CHAIN_ID;
      const walletAddress = localStorage.getItem('walletAddress') || configs.DEFAULT_WALLET_ADDRESS;
      try {
        if (token?.address && chainId && walletAddress) {
          const response = await axios.get(
            `${configs.NODE_API_URL}/tokens/fetchBalance?tokenAddress=${token?.address}&walletAddress=${walletAddress}&chain=${chainId}`
          );
          const fiatValue = response.data;
          const accountAddress = walletAddress;
          const provider = new ethers.JsonRpcProvider(rpcUrls[chainId]);
          let tokenBalance;
          if (token?.address === configs.DEFAULT_TOKEN_ADDRESS) {
            const balance = await provider.getBalance(accountAddress);
            tokenBalance = ethers.formatUnits(balance.toString(), 18);
          } else {
            const contract = new ethers.Contract(token?.address, abi, provider);
            const decimals = await contract.decimals();
            const balanceAmount = await contract.balanceOf(accountAddress);
            tokenBalance = ethers.formatUnits(balanceAmount.toString(), decimals);
          }

          const truncatedBalance = tokenBalance.slice(0, 6);

          if (isFrom) {
            // this.fromFiat = fiatValue;
            this.fromTokenBalance = Number(parseFloat(response.data).toFixed(4));
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
    handleDebounce: debounce(function (event, model) {
      this.sanitizeInput(event, model);
    }, 1000),
    debouncedSanitizeInput: function (event, model) {
      let value = event.target.value;
      if (value === '') {
        this[model] = '';
      } else {
        value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        this[model] = value;
        this.setTokenQuantity(value);
      }
      this.handleDebounce(event, model);
    },

    sanitizeInput(event, model) {
      // if (this.selectedFromToken && model === 'fromTokenQuantity') {
      //   this.updateTokenBalance(this.selectedFromToken, true);
      // }

      this.calculateRatio(model === 'fromTokenQuantity' ? 'from' : 'to');
    },
    async calculateRatio(origin, isFromTokenChanged) {
      if (this.isCalculatingRatio) {
        return;
      }

      this.isCalculatingRatio = true;

      if (origin !== 'to') {
        return new Promise(async (resolve, reject) => {
          if (this.disableRecalculation) {
            this.isCalculatingRatio = false;
            return resolve(null);
          }

          if (
            !this.selectedFromToken ||
            !this.selectedReceiveToken ||
            // !this.fromFiat ||
            // !this.toFiat ||
            // this.fromTokenBalance == 0 ||
            this.fromTokenQuantity == 0
          ) {
            this.isCalculatingRatio = false;
            return resolve(null);
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
            walletAddress: localStorage.getItem('walletAddress') || configs.DEFAULT_WALLET_ADDRESS,
            chain: parseInt(localStorage.getItem('chainId')) || configs.DEFAULT_CHAIN_ID,
            amountIn: this.fromTokenQuantity,
            slippageTolerance: this.slippageValue,
          };
          try {
            if (isFromTokenChanged) {
              const tokenAllowance = await axios.get(`${configs.NODE_API_URL}/tokens/allowances`, {
                params: {
                  tokenAddress: this.selectedFromToken.address,
                  walletAddress: localStorage.getItem('walletAddress') || '0xB7aacD03a2f18a9868fdCA4e664c57f5a2d4008f',
                  chain: parseInt(localStorage.getItem('chainId')) || 1,
                },
              });
              this.setTokenAllowance(tokenAllowance);
              this.allowanceResponse = tokenAllowance?.data;
            }

            const response = await axios.post(`${configs.NODE_API_URL}/tokens/buildSwapTx`, quotationData);

            this.quotationResponse = response.data;
            this.setQuotationResponse(response.data);

            let formattedQuotation;

            const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
            if (quotationData.toTokenObj.address === configs.DEFAULT_TOKEN_ADDRESS) {
              const fetchedQuotation = response?.data?.amountOut;
              formattedQuotation = fetchedQuotation;
            } else {
              const tokenInstance = new ethers.Contract(quotationData.toTokenObj.address, abi, provider);
              formattedQuotation = response?.data?.amountOut;
            }

            this.ratio = formattedQuotation;
            resolve(formattedQuotation);
          } catch (error) {
            console.error('Error fetching quotation:', error);
            this.ratio = 0;
            reject(error);
          } finally {
            this.isLoadingQuotation = false;
            this.isCalculatingRatio = false;
          }
        });
      } else {
        return new Promise(async (resolve, reject) => {
          if (this.disableRecalculation) {
            this.isCalculatingRatio = false;
            return resolve(null);
          }

          if (!this.selectedFromToken || !this.selectedReceiveToken || !+this.ratio) {
            return resolve(null);
          }

          this.isLoadingFromQuotation = true;

          const quotationData = {
            fromTokenObj: {
              address: this.selectedReceiveToken.address,
              decimals: this.selectedReceiveToken.decimals,
              symbol: this.selectedReceiveToken.symbol,
              name: this.selectedReceiveToken.name,
            },
            toTokenObj: {
              address: this.selectedFromToken.address,
              decimals: this.selectedFromToken.decimals,
              symbol: this.selectedFromToken.symbol,
              name: this.selectedFromToken.name,
            },
            walletAddress: localStorage.getItem('walletAddress') || configs.DEFAULT_WALLET_ADDRESS,
            chain: parseInt(localStorage.getItem('chainId')) || configs.DEFAULT_CHAIN_ID,
            amountIn: this.ratio,
            slippageTolerance: this.slippageValue,
          };

          try {
            const tokenAllowance = await axios.get(`${configs.NODE_API_URL}/tokens/allowances`, {
              params: {
                tokenAddress: this.selectedFromToken.address,
                walletAddress: localStorage.getItem('walletAddress') || '0xB7aacD03a2f18a9868fdCA4e664c57f5a2d4008f',
                chain: parseInt(localStorage.getItem('chainId')) || 1,
              },
            });
            this.setTokenAllowance(tokenAllowance);
            this.allowanceResponse = tokenAllowance?.data;
            const response = await axios.post(`${configs.NODE_API_URL}/tokens/buildSwapTx`, quotationData);

            this.quotationResponse = response.data;
            this.setQuotationResponse(response.data);

            let formattedQuotation;

            const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
            if (quotationData.toTokenObj.address === configs.DEFAULT_TOKEN_ADDRESS) {
              const fetchedQuotation = response?.data?.amountOut;
              formattedQuotation = fetchedQuotation;
            } else {
              const tokenInstance = new ethers.Contract(quotationData.toTokenObj.address, abi, provider);
              formattedQuotation = response?.data?.amountOut;
            }

            this.fromTokenQuantity = formattedQuotation;
            resolve(formattedQuotation);
          } catch (error) {
            console.error('Error fetching quotation:', error);
            this.ratio = 0;
            reject(error);
          } finally {
            this.isLoadingFromQuotation = false;
            this.isCalculatingRatio = false;
          }
        });
      }
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
          await this.fetchAndSetDefaultToken();
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

      const chainId =
        parseInt(localStorage.getItem('chainId')) ||
        this.lastSelectedChainId ||
        1;
      const desiredSymbol = symbolMap[chainId];
      const defaultToken = this.fetchedData?.find((token) => token.symbol === desiredSymbol);
      console.log(defaultToken, 'defaultToken');
      if (defaultToken) {
        this.selectedFromToken = defaultToken;
        this.selectedFromTokenAddress = defaultToken?.address;
        this.setTokenAddress(defaultToken);
        this.updateTokenBalance(defaultToken, true);
      }
    },
    updateStateBasedOnChainId() {},

    resetTransactionFields() {
      this.selectedToToken = null;
      this.selectedReceiveToken = null;
      this.resetState();
      this.fromTokenQuantity = '';
      this.fromCalculatedFiat = '';
      this.ratio = '';
      this.toTokenBalance = '';
      this.toFiat = 0;

      this.clearInputField();
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    async swapTokens() {
      this.disableRecalculation = true;

      [this.selectedFromToken, this.selectedReceiveToken] = [this.selectedReceiveToken, this.selectedFromToken];
      [this.selectedFromTokenAddress, this.selectedToTokenAddress] = [
        this.selectedToTokenAddress,
        this.selectedFromTokenAddress,
      ];

      this.UpdateState(this.ratio);
      this.fromTokenQuantity = this.ratio;
      // Swap the input quantities
      const tempQuantity = this.fromTokenQuantity;
      this.ratio = tempQuantity;

      // Swap the token balances
      [this.fromTokenBalance, this.toTokenBalance] = [this.toTokenBalance, this.fromTokenBalance];
      this.disableRecalculation = false;
      this.$nextTick(() => {
        this.updateFromCalculatedFiat();
      });
      this.$forceUpdate();
    },
    updateFromCalculatedFiat() {
      this.fromCalculatedFiat = (this.fromFiat * parseFloat(this.fromTokenQuantity)).toFixed(2);
    },
    clearInputField() {
      this.fromTokenQuantity = '';
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
        !this.fromTokenQuantity ||
        this.fromTokenQuantity === '0' ||
        parseFloat(this.fromTokenQuantity) > parseFloat(this.fromTokenBalance) ||
        !this.selectedToTokenAddress ||
        !this.ratio ||
        this.ratio == '' ||
        this.isTransactionPending
      );
    },
    buttonText() {
      if (!this.isConnected) {
        return 'Connect Wallet';
      } else if (this.selectedToTokenAddress == null || this.selectedToTokenAddress == '') {
        return 'Select Token';
      } else if (!this.fromTokenQuantity || this.fromTokenQuantity === '0' || this.fromTokenQuantity === '') {
        return 'Enter an Amount';
      } else if (this.fromTokenQuantity >= this.fromTokenBalance || this.fromTokenBalance == 0) {
        return 'Insufficient balance';
      } else if (this.allowanceResponse == 0) {
        return 'Approve and Swap';
      } else {
        return this.isTransactionPending ? 'Processing...' : 'Swap';
      }
    },
  },
  mounted() {
    const toTokenSymbol = this.getUrlParameter('toToken');
    if (toTokenSymbol) this.isFetchingToToken = true;
    this.initializeData();
  },
  watch: {
    isConnected(newVal) {
      if (newVal) {
        this.initializeData();
      }
    },
    formattedAddress(address) {
      if (!address) return;
      localStorage.setItem('walletAddress', address);

      this.initializeData();
    },
    getChainId(newChainId) {
      this.fetchTokens().then(() => {
        // this.selectedFromToken = null;
        // this.selectedReceiveToken = null;
        // this.fromTokenQuantity = '';
        // this.isLoadingQuotation = false;
        // this.ratio = '';
        // this.fromTokenBalance = 0;
        // this.toTokenBalance = 0;
        this.isLoadingQuotation = false;
        this.resetTransactionFields();
        this.setDefaultToken();
      });
    },
    selectedFromToken(newVal, oldVal) {
      if (newVal !== oldVal) this.calculateRatio('from', 'fromTokenChanged');
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
        const Msg = 'Transaction successfully';
        notification.notify({
          text: Msg,
          type: 'success',
          duration: 2000,
          speed: 1000,
        });

        setTimeout(async () => {
          try {
            const chainId = this.getChainId ?? this.netWorkId;
            const response = await axios.get(
              `${configs.NODE_API_URL}/tokens/fetchBalance?tokenAddress=${this.selectedFromToken.address}&walletAddress=${this.walletAddress}&chain=${chainId}`
            );
            this.fromTokenBalance = Number(parseFloat(response.data).toFixed(4));
          } catch (error) {
            console.error('Error fetching balance:', error);
          }
        }, 35000);
      }
    },
    error(newVal) {
      if (newVal) {
        const errorMessage = newVal.message ? newVal.message : 'No message available';
        const userRejectedMessage = 'User rejected the request';
        const isUserRejected = errorMessage.includes(userRejectedMessage);
        const Msg = isUserRejected ? userRejectedMessage : '';
        notification.notify({
          text: Msg,
          type: 'warn',
          duration: 2000,
          speed: 1000,
        });
      }
    },
    isPending(newVal) {
      this.isTransactionPending = newVal;
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
.disabled-button {
  opacity: 0.5;
  cursor: no-drop;
}
</style>
