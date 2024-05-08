<template>
  <div v-if="isVisible" class="modal-overlay" @click="hideModal">
    <div class="modal swap-modal" @click.stop>
      <div class="modal-header">
        <h2>Select a token</h2>
        <span class="close" @click="hideModal">&times;</span>
      </div>
      <div class="modal-body">
        <div class="search-token">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1"
                ><SearchIcon
              /></span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Search name or paste address"
              aria-describedby="basic-addon1"
            />
          </div>
          <div class="dropdown-option">
            <button class="dropdown-btn-header" @click="toggleDropdown">
              <img
                :src="selectedImageUrl"
                alt="Selected Coin"
                class="dropdown-img"
              />
              <DropdownIcon />
            </button>
            <!-- dropdown menu -->

            <ul class="dropdown-list" v-if="isDropdownVisible">
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
        <div class="swap-logo-list">
          <button>
            <img
              src="../../assets/images/zrx-icon.png"
              :alt="icon"
              class="token-logo"
            />
            <span>ZRX</span>
          </button>
          <button>
            <img
              src="../../assets/images/zrx-icon.png"
              :alt="icon"
              class="token-logo"
            />
            <span>ZRX</span>
          </button>
          <button>
            <img
              src="../../assets/images/zrx-icon.png"
              :alt="icon"
              class="token-logo"
            />
            <span>ZRX</span>
          </button>
          <button>
            <img
              src="../../assets/images/zrx-icon.png"
              :alt="icon"
              class="token-logo"
            />
            <span>ZRX</span>
          </button>
        </div>
        <div class="swap-popular-token">
          <h4>Popular tokens</h4>
          <div class="swap-token-list">
            <ul>
              <li>
                <div class="tk-list">
                  <img
                    src="../../assets/images/zrx-icon.png"
                    :alt="icon"
                    class="token-logo"
                  />
                  <div class="tokenname">
                    <h3>1inch</h3>
                    <h5>1INCH</h5>
                  </div>
                </div>
              </li>
                 <li>
                <div class="tk-list">
                  <img
                    src="../../assets/images/zrx-icon.png"
                    :alt="icon"
                    class="token-logo"
                  />
                  <div class="tokenname">
                    <h3>1inch</h3>
                    <h5>1INCH</h5>
                  </div>
                </div>
              </li>
                 <li>
                <div class="tk-list">
                  <img
                    src="../../assets/images/zrx-icon.png"
                    :alt="icon"
                    class="token-logo"
                  />
                  <div class="tokenname">
                    <h3>1inch</h3>
                    <h5>1INCH</h5>
                  </div>
                </div>
              </li>
                 <li>
                <div class="tk-list">
                  <img
                    src="../../assets/images/zrx-icon.png"
                    :alt="icon"
                    class="token-logo"
                  />
                  <div class="tokenname">
                    <h3>1inch</h3>
                    <h5>1INCH</h5>
                  </div>
                </div>
              </li>
                 <li>
                <div class="tk-list">
                  <img
                    src="../../assets/images/zrx-icon.png"
                    :alt="icon"
                    class="token-logo"
                  />
                  <div class="tokenname">
                    <h3>1inch</h3>
                    <h5>1INCH</h5>
                  </div>
                </div>
              </li>
                 <li>
                <div class="tk-list">
                  <img
                    src="../../assets/images/zrx-icon.png"
                    :alt="icon"
                    class="token-logo"
                  />
                  <div class="tokenname">
                    <h3>1inch</h3>
                    <h5>1INCH</h5>
                  </div>
                </div>
              </li>
                 <li>
                <div class="tk-list">
                  <img
                    src="../../assets/images/zrx-icon.png"
                    :alt="icon"
                    class="token-logo"
                  />
                  <div class="tokenname">
                    <h3>1inch</h3>
                    <h5>1INCH</h5>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchIcon from '../icons/icon-search.vue';
import DropdownIcon from '../../components/icons/icon-dropdown.vue';
import CheckIcon from '../../components/icons/token-check.vue';
import { getImageCoin } from '../../utils/helpers/formatter-images';
import '../../assets/scss/modal/swap-modal.scss';
export default {
  name: 'WalletModal',
  data() {
    return {
      isWalletModalVisible: false,
      chainId: '',
      walletAddress: '',
      isDropdownVisible: false,
      dropdownItems: [
        { name: 'Ethereum', slug: 'ethereum', chainId: 1, checked: false },
        { name: 'Binance', slug: 'binance-coin', chainId: 56, checked: false },
        { name: 'Polygon', slug: 'polygon', chainId: 137, checked: false },
      ],
      selectedImageUrl: '',
    };
  },
  components: {
    SearchIcon,
    DropdownIcon,
    CheckIcon,
  },
  props: {
    isVisible: Boolean,
  },
  methods: {
    hideModal() {
      this.$emit('hide-modal');
    },
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
  },
  mounted() {
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
};
</script>
<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9;
}
.close {
  cursor: pointer;
  color: #000;
  font-size: 30px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 15px;
  right: 15px;
}
.modal {
  width: 35%;
  min-width: 320px;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.modal-header {
  color: #000;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid transparent;
  padding: 0 20px;
  margin-bottom: 15px;
}

.modal-description {
  color: #666;
  font-size: 15px;
  // text-align: center;
  // padding: 20px 0;
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
}

.modal-button {
  margin: 10px 0;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: #fff;
  background-color: #01b7ff;
  font-weight: 600;
  cursor: pointer;
  display: block;
}
</style>
