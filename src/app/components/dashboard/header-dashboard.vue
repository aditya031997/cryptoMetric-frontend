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
      <div class="border-none bg-none connect-btn">
        <button
          v-if="!walletAddress"
          @click="connectWallet"
        >
          Connect
        </button>
        <button
          v-else
          @click="disconnectAccount"
        >
          <popper-tooltip
            custom-class="header-logout"
            placement="bottom"
            :disabled="isDnd || poppersOff"
          >
            <iconSwitch />
            <template v-slot:popper>Disconnect</template>
          </popper-tooltip>
        </button>
      </div>
      <div
        v-if="walletAddress"
        class="header-dashboard__connected-address"
      >
        <div class="address-box">
          <figure>
            <img
              src="../../assets/images/img-avatar.png"
              alt=""
            />
          </figure>
          <div class="content">
            <p class="wallet-address">
              {{ formatAddress(walletAddress) }}
            </p>
          </div>
        </div>
      </div>
      <div class="header-dashboard__section">
        <dashboard-settings v-if="this.$route.meta.headerName === 'Home'" />
        <user-notify />
        <user-profile />
      </div>
    </header>
    <wallet-modal
      :is-visible="isWalletModalVisible"
      @hide-modal="connectWallet"
      @account-changed="handleAccountChanged"
    />
    <Web3Exchange
      :is-visible="isWebExchangeModalVisible"
      @hide-modal="isWebExchangeModalVisible = false"
    />
  </div>
</template>

<script>
import iconBack from '../icons/icon-back.vue';
import iconSwitch from '../icons/icon-switch.vue';
import ButtonIcon from '../ui/button/button-icon.vue';
import UserProfile from './user-profile.vue';

import PopperTooltip from '@/components/poppers/popper-tooltip.vue';
import UserNotify from './user-notify.vue';
import DashboardSettings from './dashboard-settings.vue';
import IconBurger from '../icons/icon-burger.vue';
import WalletModal from '../modals/web3-modal.vue';
import Web3 from 'web3';

export default {
  components: {
    iconBack,
    PopperTooltip,
    iconSwitch,
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
      walletAddress: localStorage.getItem('walletAddress') || '',
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
    handleAccountChanged(newAddress) {
      this.walletAddress = newAddress;
      this.walletAddress1 = newAddress;
    },
    disconnectAccount() {
      this.walletAddress = '';
      localStorage.removeItem('walletAddress');
    },
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
          const account = await window.ethereum.request({
            method: 'eth_accounts',
          });
          if (account.length > 0) {
            this.walletAddress = account[0]
            this.isWalletModalVisible = false; 
          } else {
            this.isWalletModalVisible = !this.isWalletModalVisible;
          }
        } catch (error) {}
      }
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
};
</script>

<style
  lang="scss"
  scoped
>
/* .popper-tooltip .is-active {
  position: absolute !important;
  top: 21px !important;
} */
</style>
