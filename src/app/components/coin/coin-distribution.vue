<template>
  <div class="iframe-container">
    <iframe
      :src="iframeSrc"
      class="custom-iframe"
    />
  </div>
</template>

<script>
import axios from 'axios';
import configs from '../../../configs/configs';

export default {
  name: 'coin-distribution',
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
          `${configs.LOCAL_API_URL}/api/supply/tokenByName?query=${this.symbol}`
        );
        const tokenData = tokenResponse.data.msg;
        if (tokenData) {
          const symbol = tokenData.symbol;
          const tokenAddress = tokenData.tokenAddress;
          this.iframeSrc = `https://app.bubblemaps.io/${symbol}/token/${tokenAddress}`;
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
      } finally {
        this.isLoad = false;
      }
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
</style>
