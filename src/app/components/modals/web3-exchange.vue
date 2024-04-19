<template>
  <div
    class="modal-overlay"
    v-if="isVisible"
    @click.self="hideModal"
  >
    <div
      class="modal"
      @click.stop
    >
      <div class="modal-body">
        <div class="tokenlist">
          <label
            for="select-field-from"
            class="form-label"
            >From:</label
          >
          <div class="tk-select">
            <select
              v-model="selectedFromToken"
              @change="handleSelect1(selectedFromToken)"
              :disabled="loading"
              id="select-field-from"
              class="form-select"
              aria-label="select-field-from"
            >
              <option
                v-for="token in tokens"
                :key="token.address + token.name"
                :value="token.address"
              >
                {{ token.name }}
              </option>
            </select>
          </div>
          <input
            v-model="selectedTokenQuantity1"
            type="number"
            min="0"
            placeholder="Quantity"
            @input="calculateRatio"
            class="form-control"
          />
        </div>
        <button
          @click="swapTokens"
          class="exchange-button btn btn-primary"
        >
          Exchange
        </button>
        <div class="tokenlist">
          <label
            for="select-field-to"
            class="form-label"
            >To:</label
          >
          <div class="tk-select">
            <select
              v-model="selectedToToken"
              @change="handleSelect2(selectedToToken)"
              :disabled="loading"
              id="select-field-to"
              class="form-select"
              aria-label="select-field-to"
            >
              <option
                v-for="token in tokens"
                :key="token.address + token.name"
                :value="token.address"
              >
                {{ token.name }}
              </option>
            </select>
          </div>
          <div>
            <p class="ratio-value">{{ ratio }}</p>
          </div>
        </div>
      </div>
      <button
        class="modal-button connect-wallet btn btn-primary"
        @click="handleTrade"
      >
        Swap
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import Web3 from 'web3';

export default {
  name: 'web3exchange',
  props: {
    isVisible: Boolean,
    loading: Boolean,
  },
  data() {
    return {
      tokens: [],
      selectedFromToken: '',
      selectedToToken: '',
      selectedTokenQuantity1: 1,
      selectedTokenQuantity2: 1,
      msg1: '',
      msg2: '',
      ratio: '',
      isSwapped: false,
    };
  },
  methods: {
    async handleSelect1(selectedValue) {
      Cookies.set('tokenone', selectedValue, { expires: 7 });

      const response = await axios.get(
        `http://localhost:5000/tokens/convert?chain=1&addresses=${selectedValue}`
      );
      this.msg1 = response.data.msg;
      this.calculateRatio();
    },
    async handleSelect2(selectedValue) {
      Cookies.set('tokentwo', selectedValue, { expires: 7 });

      const response = await axios.get(
        `http://localhost:5000/tokens/convert?chain=1&addresses=${selectedValue}`
      );
      this.msg2 = response.data.msg;
      this.calculateRatio();
    },
    calculateRatio() {
      const value1 = parseFloat(this.msg1) * this.selectedTokenQuantity1;
      const value2 = parseFloat(this.msg2) * this.selectedTokenQuantity2;

      if (!isNaN(value1) && !isNaN(value2) && value2 !== 0) {
        this.ratio = value1 / value2;
      } else {
        this.ratio = '';
      }
    },
    async fetchTokenData() {
      try {
        const response = await axios.get('http://localhost:5000/tokens/swager');
        const responseData = response.data.msg;
        const tokensArray = Object.entries(responseData.tokens).map(
          ([address, tokenData]) => ({
            address,
            ...tokenData,
          })
        );
        this.tokens = tokensArray.map((token) => ({
          value: token.symbol,
          address: token.address,
          name: token.name,
          logo: token.logoURI,
        }));
        this.selectedFromToken = this.tokens[0].address;
        this.selectedToToken = this.tokens[0].address;
        this.msg1 = 'Price';
        this.msg2 = 'Price ';
      } catch (error) {
        console.error('Error fetching token data:', error.message);
      }
    },

    async handleTrade() {
      const web3 = new Web3(window.ethereum);
      const savedAccount = await web3.eth.getAccounts()
      const tokenone = Cookies.get('tokenone');
      let parseData;
      //  return console.log(savedAccount, tokenone);
      try {
        const allowanceResponse = await axios.get(
          `http://localhost:5000/tokens/allowance`,
          {
            params: {
              tokenAddress: `${tokenone}`,
              walletAddress: `${savedAccount}`,
            },
          }
        );
        console.log(allowanceResponse, 'herererer');
        const allowance = allowanceResponse.data.allowance;
        setTimeout(async () => {
          if (allowance === '0') {
            const approve = await axios.get(
              `http://localhost:5000/tokens/approveTransaction?tokenAddress=${tokenone}`
            );
            console.log(approve.data);
            const approvedData = approve.data;
            console.log(approvedData, 'approvedData');
            parseData = JSON.parse(approvedData);
            console.log(parseData, 'parseData');
            console.log(window.ethereum, 'window.ethereum');
          }
          if (window.ethereum) {
            // Use MetaMask's provider
            const web3 = new Web3(window.ethereum);

            try {
              // Request account access if needed
              await window.ethereum.request({ method: 'eth_requestAccounts' });

              // Get the selected account
              const accounts = await web3.eth.getAccounts();
              const senderAddress = accounts[0];

              // Transaction details
              const transaction = {
                from: senderAddress,
                to: parseData.to, // Recipient address
                value: parseData.value, // Value to send (in wei)
                data: parseData.data, // Transaction data
              };
              console.log(transaction,"transaction")
              // Send transaction
              const txHash = await web3.eth.sendTransaction(transaction);
              console.log('Transaction sent:', txHash);
              alert('Transaction sent! Check your MetaMask.');
            } catch (error) {
              console.error('Error sending transaction:', error);
              alert('Transaction failed. See console for error.');
            }
          } else {
            alert('Please install MetaMask to use this feature.');
          }
          console.log('make swap');
        }, 1000);
      } catch (err) {
        console.error(err);
        alert('Swap error.');
      }
    },
    hideModal() {
      // Add your hideModal logic here
    },
    swapSelections() {
      const temp = this.selectedFromToken;
      this.selectedFromToken = this.selectedToToken;
      this.selectedToToken = temp;
      this.isSwapped = !this.isSwapped;
      this.fetchTokenData();
    },
    swapTokens() {
      const tempToken = this.selectedFromToken;
      const tempQuantity = this.selectedTokenQuantity1;

      this.selectedFromToken = this.selectedToToken;
      this.selectedTokenQuantity1 = this.ratio;

      this.selectedToToken = tempToken;
      this.selectedTokenQuantity2 = tempQuantity;

      this.calculateRatio();
    },
  },
  mounted() {
    this.fetchTokenData();
  },
};
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  width: 600px;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
}

.tokenlist {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-label {
  font-weight: bold;
}

.form-select,
.form-control {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.exchange-button {
  grid-column: 1 / 3;
  justify-self: center;
  width: 50%;
}
.modal-button {
  display: block;
  width: 100%;
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.exchange-button:hover,
.modal-button:hover {
  background-color: #0056b3;
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
</style>
