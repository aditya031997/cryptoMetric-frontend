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
          v-model="selectedTokenQuantity1"
          type="text"
          min="0"
          placeholder="0"
          @input="sanitizeInput($event, 'selectedTokenQuantity1')"
          class="form-control number-input"
        />

        <p
          class="pay-content"
          v-if="convertedData1 > 0"
        >
          ${{ convertedData1 }}
        </p>
      </div>
      <div class="right-side-input-css">
        <multiselect
          v-model="selectedFromToken"
          :options="tokens"
          :custom-label="customLabel"
          @select="handleSelect1"
          :disabled="loading"
          placeholder="Select token"
        >
          <template #option="{ option }">
            <div class="option-template">
              <img
                v-if="option.logoURI"
                :src="option.logoURI"
                :alt="option.name"
                class="token-logo"
              />
              <span>{{ option.name }} {{ option.symbol }}</span>
            </div>
          </template>
          <template #singleLabel="{ option }">
            <div class="selected-option">
              <img
                v-if="option.logoURI"
                :src="option.logoURI"
                :alt="option.name"
                class="token-logo"
              />
              <span>{{ option.name }} {{ option.symbol }}</span>
            </div>
          </template>
        </multiselect>
        <div
          class="right-side-balance-box"
          v-if="msg1 != 0 || msg1 != ''"
        >
          Balance: {{ tokenBalance1 }}
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
        <multiselect
          v-model="selectedToToken"
          :options="tokens"
          :custom-label="customLabel"
          @select="handleSelect2"
          :disabled="loading"
          placeholder="Select token"
        >
          <template #option="{ option }">
            <div class="option-template">
              <img
                v-if="option.logoURI"
                :src="option.logoURI"
                :alt="option.name"
                class="token-logo"
              />
              <span>{{ option.name }} {{ option.symbol }}</span>
            </div>
          </template>
          <template #singleLabel="{ option }">
            <div class="selected-option">
              <img
                v-if="option.logoURI"
                :src="option.logoURI"
                :alt="option.name"
                class="token-logo"
              />
              <span>{{ option.name }} {{ option.symbol }}</span>
            </div>
          </template>
        </multiselect>
        <p v-if="msg2 != 0 || msg2 != ''">Balance: {{ tokenBalance2 }}</p>
      </div>
    </div>
    <button
      class="modal-button connect-wallet btn"
      @click="handleTrade"
      :disabled="isDisabled"
    >
      {{ buttonText }}
    </button>
  </div>
</template>
  <script>
import axios from 'axios';
import Cookies from 'js-cookie';
import Web3 from 'web3';
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
      selectedToToken: null,
      selectedTokenQuantity1: '',
      selectedTokenQuantity2: '',
      tokenBalance1: '',
      tokenBalance2: '',
      chainId: '',
      msg1: 0,
      msg2: 0,
      balance: '0',
      convertedData1: '',
      convertedData2: '',
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
    sanitizeInput(event, model) {
      let value = event.target.value;
      value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

      this[model] = value;

      this.calculateRatio(model === 'selectedTokenQuantity1' ? 'from' : 'to');
    },
    async handleSelect1(selectedOption) {
      Cookies.set('tokenone', selectedOption.address, { expires: 7 });

      const response = await axios.get(
        `${configs.NODE_API_URL}/tokens/convert?chain=${this.chainId}&addresses=${selectedOption.address}`
      );

      this.msg1 = response.data.msg;
      this.convertedData1 = response.data.msg * this.selectedTokenQuantity1;

      const web3 = new Web3(window.ethereum);
      const account = (await web3.eth.getAccounts())[0];
      const provider = new ethers.BrowserProvider(window.ethereum);

      let tokenBalance;

      if (
        selectedOption.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
      ) {
        const signer = await provider.getSigner();
        const bal = await provider.getBalance(signer.address);
        tokenBalance = ethers.formatUnits(bal.toString(), 18);
      } else {
        // Handle ERC-20 token
        const contract = new ethers.Contract(
          selectedOption.address,
          abi,
          provider
        );
        const decimals = await contract.decimals();
        const balanceAmount = await contract.balanceOf(account);
        tokenBalance = ethers.formatUnits(balanceAmount.toString(), decimals);
      }
      const first4Chars = tokenBalance.slice(0, 4);
      this.tokenBalance1 = first4Chars;
      this.calculateRatio();
    },
    async handleSelect2(selectedOption) {
      Cookies.set('tokentwo', selectedOption.address, { expires: 7 });
      const response = await axios.get(
        `${configs.NODE_API_URL}/tokens/convert?chain=${this.chainId}&addresses=${selectedOption.address}`
      );
      this.msg2 = response.data.msg;
      const web3 = new Web3(window.ethereum);
      const account = (await web3.eth.getAccounts())[0];
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        selectedOption.address,
        abi,
        provider
      );
      const decimals = await contract.decimals();
      const balanceAmount = await contract.balanceOf(account);
      const formatedBalance = ethers.formatUnits(
        balanceAmount.toString(),
        decimals
      );
      const first4Chars = formatedBalance.slice(0, 4);
      this.tokenBalance2 = first4Chars;
      this.calculateRatio();
    },
    calculateRatio(origin) {
      if (!this.selectedFromToken || !this.selectedToToken) {
        return;
      }

      const input1 = parseFloat(this.selectedTokenQuantity1) || 0;
      const input2 = parseFloat(this.ratio) || 0;

      // Swap msg1 and msg2 if tokens are swapped
      let rateFromMsg1 = parseFloat(this.msg1) || 0;
      let rateFromMsg2 = parseFloat(this.msg2) || 0;
      if (this.isSwapped) {
        [rateFromMsg1, rateFromMsg2] = [rateFromMsg2, rateFromMsg1];
      }

      if (origin === 'from' && !isNaN(input1) && rateFromMsg2 !== 0) {
        const result = (input1 * rateFromMsg1) / rateFromMsg2;
        this.ratio = result.toFixed(2);
      } else if (origin === 'to' && !isNaN(input2) && rateFromMsg1 !== 0) {
        const result = (input2 * rateFromMsg2) / rateFromMsg1;
        this.selectedTokenQuantity1 = result.toFixed(2);
      }
    },
    setMaxTokenQuantity() {
      const maxQuantity = parseFloat(this.tokenBalance1) - 0.01;
      this.selectedTokenQuantity1 =
        maxQuantity > 0 ? maxQuantity.toFixed(2) : '0';
      this.calculateRatio('from');
    },
    toggleSlippageModal() {
      this.showSlippageModal = !this.showSlippageModal;
    },
    setToCustom() {
      this.selectOption('custom');
    },
    selectOption(option) {
      this.selectedOption = option;
      if (option === 'auto') {
        this.slippageType = 'auto';
        // Set the default slippage value for auto option
        this.slippage = 0.5;
      } else if (option === 'custom') {
        this.slippageType = 'custom';
        // Reset the slippage value for custom option
        // this.slippage = null;
        this.slippage = 0.5;
      }
    },
    toggleAccordion(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    },
    async fetchTokenData() {
      if (!this.chainId) {
        setTimeout(() => this.fetchTokenData(), 1000);
        return;
      }
      try {
        [];
        const response = await axios.get(
          `${configs.NODE_API_URL}/tokens/swager?chain=${this.chainId}`
        );
        const responseData = response.data.msg;
        const tokensArray = Object.entries(responseData.tokens).map(
          ([address, tokenData]) => ({
            address,
            name: tokenData.name,
            symbol: tokenData.symbol,
            logoURI: tokenData.logoURI,
            value: tokenData.symbol,
          })
        );

        const placeholderOption = {
          name: 'Select token',
          symbol: '',
          value: null,
          logoURI: null,
        };
        this.tokens = [placeholderOption, ...tokensArray];
        this.tokens = tokensArray;
        this.selectedFromToken = placeholderOption;
        this.selectedToToken = placeholderOption;
        this.msg1 = '';
        this.msg2 = '';
      } catch (error) {
        console.error('Error fetching token data:', error.message);
      }
    },
    async getAccountBalance() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const networkId = await web3.eth.net.getId();
          this.chainId = Number(networkId); // Convert and store network ID as a number

          ethereum.on('chainChanged', (chainId) => {
            const id = parseInt(chainId, 16);
            this.chainId = id;
            this.fetchTokenData(); // Refetch token data whenever chain changes
          });

          this.fetchTokenData(); // Also fetch token data initially after getting chain ID
        } catch (error) {
          console.error('Error fetching account balance:', error);
        }
      } else {
        console.log('Please install MetaMask!');
      }
    },

    updateStateBasedOnChainId() {
      console.log(this.chainId, 'Chain ID');
    },
    async handleTrade() {
      this.isTransactionPending = true;
      const web3 = new Web3(window.ethereum);
      const savedAccount = await web3.eth.getAccounts();
      const tokenone = Cookies.get('tokenone');
      const tokentwo = Cookies.get('tokentwo');
      try {
        const allowanceResponse = await axios.get(
          `${configs.NODE_API_URL}/tokens/allowance`,
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
              `${configs.NODE_API_URL}/tokens/approveTransaction?tokenAddress=${tokenone}&chain=${this.chainId}`
            );
          }
          if (this.slippageType === 'auto') {
          } else if (this.slippageType === 'custom') {
          }

          swapData = {
            slippage: 0.5,
            src: tokenone,
            from: savedAccount[0],
            dst: tokentwo,
            chain: this.chainId,
            amount: web3.utils.toWei(
              this.selectedTokenQuantity1.toString(),
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
      this.selectedTokenQuantity1 = '';
      this.selectedTokenQuantity2 = '';
      this.ratio = '';
      this.tokenBalance1 = '';
      this.tokenBalance2 = '';
      this.msg1 = 0;
      this.msg2 = 0;
    },
    swapSelections() {
      const temp = this.selectedFromToken;
      this.selectedFromToken = this.selectedToToken;
      this.selectedToToken = temp;
      this.isSwapped = !this.isSwapped;
      this.fetchTokenData();
    },
    swapTokens() {
      const tempFromToken = this.selectedFromToken;
      const tempToToken = this.selectedToToken;
      const tempQuantity1 = this.selectedTokenQuantity1;
      const tempRatio = this.ratio;

      // Swap the tokens
      this.selectedFromToken = tempToToken;
      this.selectedToToken = tempFromToken;

      // Swap the input values
      this.selectedTokenQuantity1 = tempRatio;
      this.ratio = tempQuantity1;

      // Toggle the isSwapped flag
      this.isSwapped = !this.isSwapped;

      // Recalculate the ratio
      this.calculateRatio('from');
    },
  },
  computed: {
    isDisabled() {
      return (
        !this.ratio ||
        this.msg2 == 0 ||
        !this.selectedTokenQuantity1 ||
        this.selectedTokenQuantity1 === '0' ||
        parseFloat(this.selectedTokenQuantity1) >
          parseFloat(this.tokenBalance1) ||
        this.isTransactionPending
      ); // Disable button if transaction is pending
    },
    buttonText() {
      if (this.msg2 == 0 || this.msg2 == '') {
        return 'Select Token';
      } else if (
        !this.selectedTokenQuantity1 ||
        this.selectedTokenQuantity1 === '0' ||
        this.selectedTokenQuantity1 === ''
      ) {
        return 'Enter an Amount';
      } else if (this.selectedTokenQuantity1 >= this.tokenBalance1) {
        return 'Insufficient balance';
      } else {
        return this.isTransactionPending ? 'Processing...' : 'Swap';
      }
    },
  },
  async mounted() {
    await this.getAccountBalance().then((balance) => {
      this.balance = balance;
    });
    this.fetchTokenData();
  },
  watch: {
    selectedFromToken(newVal, oldVal) {
      if (newVal !== oldVal) this.calculateRatio('from');
    },
    selectedToToken(newVal, oldVal) {
      if (newVal !== oldVal) this.calculateRatio('from');
    },
    msg1(newVal) {
      this.calculateRatio('from');
    },
    msg2(newVal) {
      this.calculateRatio('from');
    },
    selectedTokenQuantity1(newVal) {
      if (newVal) this.calculateRatio('from');
    },
  },
};
</script>
  
  <style>
.container {
  max-width: 660px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dropdown-btn {
  position: relative;
}

.slippage-modal {
  position: absolute;
  z-index: 99;
  top: 42px;
  left: -155px;
  width: 310px;
}

.modal-content {
  padding: 3px 16px;
}

.header-btn {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
.head-right-btn {
  background-color: #f9f9f9;
  /* padding: 12px 12px; */
  border-radius: 50%;
  padding-left: 8px;
  /* gap: 4px; */
  border: none;
  /* font-size: 16px; */
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
}

.swap-btn {
  color: rgb(34, 34, 34);
  background-color: rgba(34, 34, 34, 0.07);
  padding: 8px 16px;
  border-radius: 20px;
  gap: 4px;
  font-weight: 485;
  border: none;
}

.tokenlist {
  background-color: rgb(249, 249, 249);
  border-radius: 16px;
  color: rgb(125, 125, 125);
  font-size: 14px;
  font-weight: 500;
  height: 120px;
  line-height: 20px;
  padding: 16px;
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 90px;
  align-items: center;
  /* display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem; */
}

.pay-content {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-weight: 485;
  font-size: 14px;
  color: rgb(125, 125, 125);
  letter-spacing: -0.01em;
}

.token-left-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.number-input {
  max-width: 280px;
  font-weight: 485;
  max-height: 44px;
  color: rgb(34, 34, 34);
  font-weight: 485;
  outline: none;
  border: none !important;
  flex: 1 1 auto;
  background-color: transparent;
  font-size: 28px;
  text-overflow: ellipsis;
  background: none !important;
  box-shadow: none !important;
}

.number-input:focus {
  color: #495057;
  background-color: #ffffff;
  border-color: #81dbff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(1, 183, 255, 0.25);
}

.form-label {
  font-weight: bold;
  margin-bottom: 0px;
}

.form-select,
.form-control {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.exchange-button {
  /* position: absolute; */
  margin-bottom: 2rem;
  /* padding: 0.75rem 1.5rem; */
  padding: 0;
  display: grid;
  place-items: center;
  background-color: rgb(249, 249, 249);
  color: black;
  border-radius: 12px;
  height: 40px;
  width: 40px;
  position: relative;
  margin: -22px auto;
  background-color: rgb(249, 249, 249);
  border: 4px solid rgb(255, 255, 255);
  z-index: 2;
  cursor: pointer;
}

.modal-button {
  display: block;
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.connect-wallet {
  padding: 16px;
  width: 100%;
  line-height: 24px;
  font-weight: 535;
  font-size: 20px;
  border-radius: 16px;
  border: 1px solid transparent;
  background: #28a5ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 450ms ease 0s;
  margin-top: 6px;
}

.connect-wallet:hover {
  color: white;
}

.token-logo {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.option-template {
  display: flex;
  align-items: center;
}

.token-info {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.token-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.token-price,
.ratio-value {
  font-size: 1.1rem;
}

.accordion-header {
  padding: 8px 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.accrodion-right-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.accrodion-right-content p {
  margin-bottom: 0;
}

.accordion-content {
  /* padding: 10px; */
  display: none;
  font-size: 14px;
  padding-bottom: 6px;
}

.inner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.checkbox-container {
  border: 1px solid rgba(34, 34, 34, 0.07) !important;
  border-radius: 50px;
  display: flex;
  gap: 6px;
  padding: 6px 9px;
}

.custom-btn,
.auto-btn {
  width: auto;
  cursor: pointer;
  padding: 6px 12px;
  text-align: center;
  gap: 4px;
  border-radius: 12px;
  background: none;
  border: none;
}

.checkbtn {
  background: rgba(34, 34, 34, 0.07);
}

.input-number {
  padding: 8px 16px;
  border-radius: 12px;
  width: auto;
  min-width: 100px;
  flex: 1 1 0%;
  border: 1px solid rgba(34, 34, 34, 0.07);
}

.input-number:focus-within {
  /* border: none; */
  outline: none;
  box-shadow: none;
}

.accordion-item.active .accordion-content {
  display: block;
}

.right-side-input-css {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 25px;
}

.right-side-balance-box {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 8px;
}

.right-side-balance-box button {
  color: #fc72ff;
  border: none;
  text-transform: capitalize;
  background: none;
}

.right-side-input-css p {
  margin-bottom: 0;
  text-align: end;
}
</style>
  