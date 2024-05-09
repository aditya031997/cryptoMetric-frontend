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

        <div class="dropdown-option">
          <button
            class="dropdown-btn-header"
            @click="toggleDropdown"
          >
            <img
              :src="selectedImageUrl"
              alt="Selected Coin"
              class="dropdown-img"
            />
            <DropdownIcon />
          </button>
          <!-- dropdown menu -->

          <ul
            class="dropdown-list"
            v-if="isDropdownVisible"
          >
            <li
            class="dropdown-item show-active"
              v-for="(item, index) in dropdownItems"
              :key="item.name"
              :class="{ 'is-checked': item.checked }"
              @click="
                toggleCheck(index);
                switchNetwork(item.name);
              "
            >
            <div >
              <img
                :src="getImageCoin(item.slug)"
                :alt="`Logo of ${item.name}`"
                class="icon-img"
              />
              {{ item.name }}
            </div>
              <CheckIcon :checked="item.checked" />
            </li>
          </ul>
        </div>
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
import DropdownIcon from '../../components/icons/icon-dropdown.vue';
import CheckIcon from '../../components/icons/token-check.vue';
import Web3 from 'web3';
import { getImageCoin } from '../../utils/helpers/formatter-images';

const networks = {
  Ethereum: {
    chainId: '0x1', // Ethereum Mainnet
    chainName: 'Ethereum Mainnet',
    rpcUrls: ['https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  Binance: {
    chainId: '0x38', // Binance Smart Chain Mainnet
    chainName: 'BNB Chain',
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  Polygon: {
    chainId: '0x89', // Polygon Mainnet
    chainName: 'Polygon Mainnet',
    rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
};

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
    DropdownIcon,
    CheckIcon,
  },

  data() {
    return {
      isWalletModalVisible: false,
      chainId: '',
      walletAddress: localStorage.getItem('walletAddress') || '',
      isDropdownVisible: false,
      dropdownItems: [
        { name: 'Ethereum', slug: 'ethereum', chainId: 1, checked: false },
        { name: 'Binance', slug: 'bnb', chainId: 56, checked: false },
        { name: 'Polygon', slug: 'polygon', chainId: 137, checked: false },
      ],
      selectedImageUrl: '',
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
    getImageCoin(slug) {
      return getImageCoin(slug);
    },
    handleAccountChanged(newAddress) {
      this.walletAddress = newAddress;
    },
    updateSelectedImage() {
      const checkedItem = this.dropdownItems.find((item) => item.checked);
      if (checkedItem) {
        this.selectedImageUrl = this.getImageCoin(checkedItem.slug);
      }
    },
    updateCheckedStatus(chainId) {
      this.dropdownItems.forEach((item) => {
        item.checked = item.chainId === chainId;
      });
      this.updateSelectedImage();
    },

    handleClickOutside(event) {
      if (!this.$el.contains(event.target) && this.isDropdownVisible) {
        this.isDropdownVisible = false;
      }
    },
    toggleCheck(index) {
      this.dropdownItems.forEach((item, i) => {
        item.checked = i === index;
      });
      this.selectedImageUrl = this.getImageCoin(this.dropdownItems[index].slug);
    },
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
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
    async switchNetwork(networkKey) {
      if (!window.ethereum) return alert('MetaMask is not installed');

      const networkData = networks[networkKey];
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: networkData.chainId }],
        });
        this.isDropdownVisible = false;
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: networkData.chainId,
                  chainName: networkData.chainName,
                  rpcUrls: networkData.rpcUrls,
                  blockExplorerUrls: networkData.blockExplorerUrls,
                },
              ],
            });
          } catch (addError) {
            console.error('Failed to add the network:', addError);
          }
        } else {
          console.error('Failed to switch the network:', switchError);
        }
      }
    },
    async connectWallet() {
      if (window.ethereum) {
        try {
          const account = await window.ethereum.request({
            method: 'eth_accounts',
          });
          if (account.length > 0) {
            this.walletAddress = account[0];
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
    async getWalletNetwork() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          const networkId = await web3.eth.net.getId();
          this.chainId = Number(networkId);
          this.updateCheckedStatus(this.chainId);
        } catch (error) {
          console.error('Failed to get network ID:', error);
        }
      } else {
        console.log(
          'Ethereum object not found. Please install MetaMask or another Ethereum-compatible browser extension.'
        );
      }
    },
  },
  mounted() {
    this.getWalletNetwork();
    document.addEventListener('click', this.handleClickOutside);
    this.selectedImageUrl = this.getImageCoin(this.dropdownItems[0].slug);

    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainIdHex) => {
        const id = parseInt(chainIdHex, 16);
        this.chainId = Number(id);
        this.updateCheckedStatus(id);
      });
    }
    this.updateSelectedImage();
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>

<style
  lang="scss"
  scoped
>
.dropdown-btn-header {
  background: #edf5fc !important;
  border: 1px solid black;
  border-radius: 30px;
  height: 38px;
  display: flex !important;
  gap: 4px !important;
  align-items: center !important;
}
.dropdown-option {
  position: relative;
  margin-left: 20px;
}
.dropdown-list {
  list-style-type: none;
  min-width: 186px;
  position: absolute;
  top: 58px;
  left: -46px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  background: white;
  border-radius: 6px;
  padding: 8px !important;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  transform: translateY(0px);
}


.dropdown-list .icon-img {
  width: 20px;
  height: 20px;
}

.show-dropdown {
  visibility: hidden;
  opacity: 0;
  transition: all 0.5s ease-in-out;
  transform: translateY(10px);
}
.dropdown-img {
  width: 20px;
  height: 20px;
  border-radius: 20px;
  object-fit: contain;
}

.dropdown-item {
  font-size: 14px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px !important;
  border-radius: 8px;
}

.is-checked{
  background: rgba(34, 34, 34, 0.07);
}
.dropdown-item div {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dropdown-item:hover {
  background: rgba(34, 34, 34, 0.07);
}

</style>
