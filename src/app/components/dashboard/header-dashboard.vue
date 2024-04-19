<template>
  <div>
    <header
      class="header-dashboard"
      :class="{ 'is-sidebar': isSideBar }"
    >
      <div class="header-dashboard__section">
        <button-icon
          custom-class="header-dashboard__button header-dashboard__button--burger"
          :on-click="onOpenSideBar"
        >
          <icon-burger />
        </button-icon>
        <button-icon
          v-if="this.$route.meta.isButtonBack"
          custom-class="header-dashboard__button"
          :on-click="onClickBack"
        >
          <icon-back />
        </button-icon>
        <h1 class="header-dashboard__title">
          <span
            v-if="!!getUserName"
            class="header-dashboard__title--name"
          >
            {{ getUserName }}
          </span>
          {{ titleHeader }}
        </h1>
      </div>
      <div>
        <button @click="Swap">Swap</button>
      </div>
      <div
        v-if="!userAddress"
        class="header-dashboard__connect-button"
      >
        <button @click="connectWallet">Connect</button>
      </div>
      <div v-else>
        <p class="header-dashboard__connected-address">
          {{ formatAddress(userAddress) }}
        </p>
      </div>
      <div class="header-dashboard__section">
        <dashboard-settings v-if="this.$route.meta.headerName === 'Home'" />
        <user-notify />
        <user-profile />
      </div>
    </header>
    <wallet-modal
      :is-visible="isWalletModalVisible"
      @hide-modal="toggleWalletModal"
    />
    <Web3Exchange
      :is-visible="isWebExchangeModalVisible"
      @hide-modal="isWebExchangeModalVisible = false"
    />
  </div>
</template>

<script>
import iconBack from '../icons/icon-back.vue';
import ButtonIcon from '../ui/button/button-icon.vue';
import UserProfile from './user-profile.vue';
import UserNotify from './user-notify.vue';
import DashboardSettings from './dashboard-settings.vue';
import IconBurger from '../icons/icon-burger.vue';
import WalletModal from '../modals/web3-modal.vue';
import Web3 from 'web3';
import Web3Exchange from '../modals/web3-exchange.vue';

// import { useSendTransaction, useWaitForTransaction } from "wagmi";

export default {
  components: {
    iconBack,
    ButtonIcon,
    UserProfile,
    UserNotify,
    DashboardSettings,
    IconBurger,
    WalletModal,
    Web3Exchange,
  },
  data() {
    return {
      isWalletModalVisible: false,
      userAddress: null,
      isWebExchangeModalVisible: false,
    };
  },
  props: {
    isSideBar: {
      type: Boolean,
    },
  },
  computed: {
    getUserName() {
      if (this.$route.meta.isUserNameHeader) {
        let name = this.$store.state.user.data?.firstname;
        if (name?.length > 8) {
          return `${name?.substring(0, 8)}...`;
        }
        return `${name}`;
      }
      return null;
    },
    titleHeader() {
      return this.$route.meta.headerName;
    },
  },
  methods: {
    onClickBack() {
      this.$router.go(-1);
    },
    onOpenSideBar() {
      this.$emit('on-open-side-bar');
    },
    onClickOpenSideBar() {
      this.$emit('on-hide-side-bar');
    },
    async connectWallet() {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          this.userAddress = accounts[0];
        } catch (error) {
          console.error('Error connecting to wallet:', error);
        }
      } else {
        console.error('MetaMask not detected');
      }
    },
    Swap() {
      this.isWebExchangeModalVisible = true;
    },
    // async Swap() {
    //   console.log("before")
    //   if (window.ethereum) {
    //     console.log("after")
    //     // Use MetaMask's provider
    //     const web3 = new Web3(window.ethereum);

    //     try {
    //       // Request account access if needed
    //       await window.ethereum.request({ method: 'eth_requestAccounts' });
    //       // Get the selected account
    //       const accounts = await web3.eth.getAccounts();
    //        console.log(accounts,"accounts")
    //       const senderAddress = accounts[0];

    //       // Transaction details
    //       const transaction = {
    //         from: senderAddress,
    //         to: '0x461B71cff4d4334BbA09489acE4b5Dc1A1813445', // Recipient address
    //         value: '0', // Value to send (in wei)
    //         data: '0x095ea7b3000000000000000000000000111111125421ca6dc452d289314280a0f8842a65ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', // Transaction data
    //       };
    //       console.log(transaction,"transaction")
    //       // Send transaction
    //       const txHash = await web3.eth.sendTransaction(transaction);
    //       console.log('Transaction sent:', txHash);
    //       alert('Transaction sent! Check your MetaMask.');

    //     } catch (error) {
    //       console.error('Error sending transaction:', error);
    //       alert('Transaction failed. See console for error.');
    //     }

    //   } else {
    //     alert('Please install MetaMask to use this feature.');
    //   }
    // },
    async toggleWalletModal() {
      if (!this.userAddress && window.ethereum) {
        await this.connectWallet();
      }
      this.isWalletModalVisible = !this.isWalletModalVisible;
    },
    formatAddress(address) {
      if (address) {
        return `${address.substring(0, 5)}...${address.substring(
          address.length - 4
        )}`;
      }
      return '';
    },
  },
  mounted() {
    this.connectWallet();
  },
};
</script>

<style
  lang="scss"
  scoped
></style>
