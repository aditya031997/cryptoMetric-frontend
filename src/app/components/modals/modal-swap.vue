<template>
  <div
    v-if="isVisible"
    class="modal-overlay"
    @click="hideModal"
  >
    <div
      class="modal swap-modal"
      @click.stop
    >
      <div class="modal-header">
        <h2>Select a token</h2>
        <span
          class="close"
          @click="hideModal"
          >&times;</span
        >
      </div>
      <div class="modal-body">
        <div class="search-token">
          <div class="input-group">
            <div class="input-group-prepend">
              <span
                class="input-group-text"
                id="basic-addon1"
                ><SearchIcon
              /></span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Search name or paste address"
              v-model="searchText"
              aria-describedby="basic-addon1"
            />
            <div class="input-group-append">
              <button
                class="btn btn-primary"
                type="button"
                @click="searchTokens"
                :disabled="!noTokensFound"
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div class="swap-logo-list">
          <button
            v-for="token in topTokens"
            :key="token.id"
            @click.stop="selectToken(token)"
          >
            <img
              :src="getTokenImage(token)"
              :alt="token.name"
              class="token-logo"
              @error="handleImageError($event, token.symbol)"
            />
            <span>{{ token.symbol }}</span>
          </button>
        </div>

        <div class="swap-popular-token">
          <div v-if="walletTokens.length > 0">
            <h4>Your tokens</h4>
            <div class="swap-token-list">
              <ul>
                <li
                  v-for="token in walletTokens"
                  :key="token.id"
                  @click.stop="selectToken(token)"
                >
                  <div class="tk-list">
                    <img
                      :src="getWalletTokenImage(token)"
                      :alt="token.name"
                      class="token-logo"
                      @error="handleImageError($event, token.symbol)"
                    />
                    <div class="tokenname">
                      <h3>{{ token.name }}</h3>
                      <h5>{{ token.symbol }}</h5>
                    </div>
                  </div>
                </li>
                <li v-if="walletTokens.length === 0">
                  <div class="tk-list">
                    <div class="tokenname">
                      <h3>No results found.</h3>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <h4>Popular tokens</h4>
          <div class="swap-token-list">
            <ul>
              <li
                v-for="token in filteredTokens"
                :key="token.id"
                @click.stop="selectToken(token)"
              >
                <div class="tk-list">
                  <img
                    :src="getTokenImage(token)"
                    :alt="token.name"
                    class="token-logo"
                    @error="handleImageError($event, token.symbol)"
                  />
                  <div class="tokenname">
                    <h3>{{ token.name }}</h3>
                    <h5>{{ token.symbol }}</h5>
                  </div>
                </div>
              </li>
              <li v-if="filteredTokens.length === 0">
                <div class="tk-list">
                  <div class="tokenname">
                    <h3>No results found.</h3>
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
import axios from 'axios';
import SearchIcon from '../icons/icon-search.vue';
import DropdownIcon from '../../components/icons/icon-dropdown.vue';
import CheckIcon from '../../components/icons/token-check.vue';
import { getImageCoin } from '../../utils/helpers/formatter-images';
import configs from '.././../../configs/configs';
import '../../assets/scss/modal/swap-modal.scss';

export default {
  name: 'TokenModal',
  data() {
    return {
      isWalletModalVisible: false,
      apiTokens: [],
      topRatedToken: [],
      networlId: '',
      filteredApiTokens: [],
      existingToken: [],
      isLoading: false,
      searchText: '',
      errorMessage: null,
    };
  },
  components: {
    SearchIcon,
    DropdownIcon,
    CheckIcon,
  },
  props: {
    isVisible: Boolean,
    chainId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    hideModal() {
      this.searchText = '';
      this.$emit('hide-modal');
    },
    selectToken(token) {
      const selectedToken = {
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        address: token.token_address || token.address,
        logoURI: token.logoURI || token.logo,
        // Add any other properties that might be needed
      };
      this.$emit('token-selected', selectedToken);
      this.hideModal();
    },
    async fetchTokens(chainId) {
      const chain = localStorage.getItem('chainId');
      chainId = chainId || 1;
      const address = localStorage.getItem('walletAddress');
      this.networlId = chainId;
      this.isLoading = true;
      try {
        const response = await axios.get(
          `${configs.NODE_API_URL}/tokens/getTokensToSwapByChainId?chain=${chain}`
        );
        this.apiTokens = response?.data;
        this.topRatedToken = response?.data;
        this.filteredApiTokens = this.apiTokens;
        this.$emit('tokens-fetched', this.apiTokens);
        this.$emit('chainId-fetched', chainId);
        const walletResponse = await axios.get(
          `${configs.NODE_API_URL}/tokens/walletToken?chain=${chain}&address=${address}`
        );
        const verifiedTokens = walletResponse.data.msg.filter(
          (token) => token.verified_contract
        );
        this.existingToken = verifiedTokens;
        this.$emit('tokens-fetched', this.apiTokens);
        this.errorMessage = null;
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchFilteredTokens(token) {
      if (!token) {
        this.filteredApiTokens = this.apiTokens;
        return;
      }
      this.isLoading = true;
      try {
        const response = await axios.get(
          `${configs.NODE_API_URL}/tokens/getTokenDetails?token=${token}&chain=${this.networlId}`
        );
        this.filteredApiTokens = response?.data || [];
      } catch (error) {
        this.errorMessage = 'Failed to load filtered tokens';
        console.error(this.errorMessage);
      } finally {
        this.isLoading = false;
      }
    },
    searchTokens() {
      this.fetchFilteredTokens(this.searchText);
    },
    getImageCoin(slug) {
      // return getImageCoin(slug.toLowerCase());
    },
    getTokenImage(token) {
      return (
        token.logoURI ||
        // this.getImageCoin(token.symbol.toLowerCase()) ||
        token.logo
      );
    },
    getWalletTokenImage(token) {
      // return token.logoURI || token.logo || this.getImageCoin(token.symbol.toLowerCase());
    },
    handleImageError(event, slug) {
      // event.target.src = this.getImageCoin(slug.toLowerCase());
    },
  },
  computed: {
    filteredTokens() {
      if (!this.searchText) {
        return Object.values(this.apiTokens);
      }
      const searchLower = this.searchText.toLowerCase().trim();
      const filteredTokens = Object.values(this.filteredApiTokens).filter(
        (token) => {
          const name = token.name ? token.name.toLowerCase() : '';
          const symbol = token.symbol ? token.symbol.toLowerCase() : '';
          const address = token.address ? token.address : '';

          return (
            name.includes(searchLower) ||
            symbol.includes(searchLower) ||
            address.includes(searchLower)
          );
        }
      );

      return filteredTokens;
    },
    walletTokens() {
      if (!this.searchText) {
        return this.existingToken;
      }
      const searchLower = this.searchText.toLowerCase().trim();
      return this.existingToken.filter((token) => {
        return (
          (token.name && token.name.toLowerCase().includes(searchLower)) ||
          (token.symbol && token.symbol.toLowerCase().includes(searchLower)) ||
          (token.address && token.address.toLowerCase().includes(searchLower))
        );
      });
    },
    topTokens() {
      return this.filteredTokens.slice(0, 5);
    },
    noTokensFound() {
      return this.filteredTokens.length === 0;
    },
  },
};
</script>

<style lang="scss" scoped>
/* Your existing styles */
</style>