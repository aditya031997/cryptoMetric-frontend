<template>
  <div class="iframe-container">
    <div v-if="iframeSrc">
      <iframe :src="iframeSrc" class="custom-iframe" />
    </div>
    <div v-else>
      <div class="loader-wrapper" v-if="isLoad">
        <cm-loader />
      </div>
      <!-- <div v-else>
        <p>No supply distribution available</p>
      </div> -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import configs from '../../../configs/configs';
import CmLoader from '@/components/ui/loader/cm-loader.vue';

export default {
  name: 'coin-distribution',
  components: {
    CmLoader,
  },
  props: {
    src: {
      type: String,
      required: false,
    },
    symbol: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      iframeSrc: '',
      isLoad: false,
    };
  },
  methods: {
    async fetchSecurityData() {
      this.isLoad = true;
      try {
        const tokenResponse = await axios.get(
          `${configs.NODE_API_URL}/supply/tokenDetail?symbol=${this.symbol}`
        );
        const tokenData = tokenResponse.data.msg[0];
        if (tokenData) {
          const chains = this.getChainShortCodes(tokenData.platform);
          if (chains.length > 0) {
            const { chainShortCode, tokenAddress } = chains[0];
            this.iframeSrc = `https://app.bubblemaps.io/${chainShortCode}/token/${tokenAddress}`;
          } else {
            this.iframeSrc = ''; 
          }
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
        this.iframeSrc = ''; // Ensure iframeSrc is empty in case of an error
      } finally {
        this.isLoad = false;
      }
    },
    getChainShortCodes(platformArray) {
      const chainMapping = {
        Ethereum: 'eth',
        'BNB Smart Chain (BEP20)': 'bsc',
        Base: 'base',
        Avalanche: 'avax',
        Polygon: 'poly',
      };

      const matchedChains = [];

      for (const platform of platformArray) {
        const shortCode = chainMapping[platform.chainName];
        if (shortCode) {
          matchedChains.push({
            chainShortCode: shortCode,
            tokenAddress: platform.tokenAddress,
          });
        }
      }

      return matchedChains;
    },
  },
  mounted() {
    this.fetchSecurityData();
  },
};
</script>

<style scoped>
.iframe-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.custom-iframe {
  width: 100%;
  height: 600px;
}
.loader-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;
}
</style>
