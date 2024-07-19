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
          `${configs.NODE_API_URL}/supply/tokenDetail?symbol=${this.symbol}`
        );
        // console.log(tokenResponse,"tokenResponsetokenResponse")
        const tokenData = tokenResponse.data.msg[0];
        console.log(tokenData.platform,"tokenDataeee")
        if (tokenData) {
          const chain = "eth";
          const tokenAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
          this.iframeSrc = `https://app.bubblemaps.io/${chain}/token/${tokenAddress}`;
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
