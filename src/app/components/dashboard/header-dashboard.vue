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
        <Account v-if="isConnected" />
        <!-- <Connect v-else /> -->
        <button
          v-else
          @click="showConnectModal = true"
        >
          Connect
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
                switchNetwork(item);
              "
            >
              <div>
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

      <div class="header-dashboard__section">
        <dashboard-settings v-if="this.$route.meta.headerName === 'Home'" />
        <user-notify />
        <user-profile />
      </div>
    </header>
    <ConnectModal
      :isVisible="showConnectModal"
      @close="showConnectModal = false"
    />
  </div>
</template>

<script>
import { useAccount, useChainId } from '@wagmi/vue';
import { reactive, toRefs, ref, watch } from 'vue';
import iconBack from '../icons/icon-back.vue';
import ButtonIcon from '../ui/button/button-icon.vue';
import UserProfile from './user-profile.vue';
import { useNotification } from '@kyvg/vue3-notification';
import UserNotify from './user-notify.vue';
import DashboardSettings from './dashboard-settings.vue';
import Account from '../dashboard/Account.vue';
import Connect from '../dashboard/Connect.vue';
import IconBurger from '../icons/icon-burger.vue';
import ConnectModal from '../modals/wallet-modal.vue';
import DropdownIcon from '../../components/icons/icon-dropdown.vue';
import CheckIcon from '../../components/icons/token-check.vue';
import Web3 from 'web3';
import { getImageCoin } from '../../utils/helpers/formatter-images';

const networks = {
  Ethereum: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    rpcUrls: ['https://eth.llamarpc.com'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  Binance: {
    chainId: '0x38',
    chainName: 'BNB Chain',
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  Polygon: {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  Base: {
    chainId: '0x2105',
    chainName: 'Base Network',
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org'],
  },
  Avalanche: {
    chainId: '0xa86a',
    chainName: 'Avalanche Network',
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io'],
  },
};

export default {
  components: {
    iconBack,
    ButtonIcon,
    UserProfile,
    ConnectModal,
    UserNotify,
    DashboardSettings,
    IconBurger,
    DropdownIcon,
    CheckIcon,
    Account,
    Connect,
  },

  data() {
    return {
      currentChainId: '',
      netWorkId: '',
      web3: null,
      currentNetwork: null,
      walletAddress: localStorage.getItem('walletAddress') || '',
      isDropdownVisible: false,
      showConnectModal: false,
      dropdownItems: [
        { name: 'Ethereum', slug: 'ethereum', chainId: 1, checked: true },
        { name: 'Binance', slug: 'bnb', chainId: 56, checked: false },
        { name: 'Polygon', slug: 'polygon', chainId: 137, checked: false },
        { name: 'Base', slug: 'base', chainId: 8453, checked: false },
        {
          name: 'Avalanche',
          slug: 'avalanche',
          chainId: 43114,
          checked: false,
        },
      ],
      selectedImageUrl: '',
    };
  },

  setup() {
    const { isConnected } = useAccount();
    const { address } = useAccount();
    // const notification = useNotification();
    const chainId = useChainId();
    let state = reactive({
      netWorkId: address._object.chainId,
    });
    return {
      ...toRefs(state),
      isConnected,
      chainId,
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
    async listenNetworkChange() {
      console.log(this.web3,"dffdfdffdf")
      this.web3.currentProvider.on('chainChanged', (chainId) => {
        this.currentNetwork = this.web3.utils.hexToNumber(chainId);
        console.log('Network changed:', this.currentNetwork);
      });
    },
    getImageCoin(slug) {
      if (slug === 'base') {
        return require('@/assets/images/base-network.png');
      }
      return getImageCoin(slug);
    },

    updateSelectedImage() {
      const checkedItem = this.dropdownItems.find((item) => item.checked);
      if (checkedItem) {
        this.selectedImageUrl = this.getImageCoin(checkedItem.slug);
      }
    },
    updateCheckedStatus() {
      const checkedItem = this.dropdownItems.find(
        (item) => item.chainId === this.netWorkId
      );
      if (checkedItem) {
        this.dropdownItems.forEach((item) => {
          item.checked = item.chainId === this.netWorkId;
        });
        this.updateSelectedImage();
      }
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

    onClickBack() {
      this.$router.go(-1);
    },
    onOpenSideBar() {
      this.$emit('on-open-side-bar');
    },
    async switchNetwork(item) {
      const networkKey = item.name;
      const chainId = item.chainId;
      this.currentChainId = chainId;
      if (!window.ethereum) return alert('MetaMask is not installed');
      const wallets = [];
      window.addEventListener('eip6963:announceProvider', (e) => {
        wallets.push(e.detail);
      });
      window.dispatchEvent(new Event('eip6963:requestProvider'));
      const walletName = localStorage.getItem('walletName');
      const matchedWallet = wallets.find(
        (wallet) => wallet.info.name === walletName
      );

      const networkData = networks[networkKey];
      try {
        await matchedWallet.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: networkData.chainId }],
        });
        const id  = parseInt(networkData.chainId, 16);
        this.$store.commit('setChainId', id);
        console.log('Switched to chainId:', id);
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
            return; // Return early to prevent network change
          }
        } else {
          console.error('Failed to switch the network:', switchError.message);
          return; // Return early to prevent network change
        }
      }
    },
  },
  watch: {
    isConnected(newValue) {
      if (newValue) {
        this.showConnectModal = false;
      }
    },
    currentChainId(newChainId) {
      this.web3 = new Web3(window.ethereum);
    },
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    const defaultNetwork = this.dropdownItems.find((item) => item.checked);
    this.selectedImageUrl = this.getImageCoin(defaultNetwork.slug);
    this.web3 = new Web3(window.ethereum);
    this.listenNetworkChange();
    this.updateCheckedStatus();
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>

<style scoped>
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
  margin-left: 8px;
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

.is-checked {
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
