<template>
  <div>
    <div v-if="dataReceived">
      <div
        v-for="(item, index) in data"
        :key="index"
      >
        <p>{{ item }}</p>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
      data: [],
      dataReceived: false,
    };
  },
  mounted() {
    this.socket = io('http://localhost:5000');
    // this.saveSocketId();
    this.socket.on('InitialTableListing', (initialData) => {
      console.log('Received InitialTableListing event:', initialData);
      this.data = initialData.data;
      this.dataReceived = true;
    });

    this.socket.on('UpdatedTableListing', (updatedData) => {
      console.log('Received UpdatedTableListing event:', updatedData);
      this.data = updatedData;
      this.saveSocketId();
    });
  },
  methods: {
    saveSocketId() {
      this.socket.emit('saveSocketId', '2');
    },
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
};
</script>
