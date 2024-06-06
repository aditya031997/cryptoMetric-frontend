<template>
  <div class="iframe-container">
    <iframe
      src="https://app.bubblemaps.io/bsc/token/0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95"
      class="custom-iframe"
    />
  </div>
</template>
  
  <script>
export default {
  name: 'coin-distribution',
  props: {
    src: {
      type: String,
      required: true,
    },
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
  