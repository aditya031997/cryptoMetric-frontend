<template>
  <div
    v-if="isVisible"
    class="modal-overlay"
    @click.self="closeModal"
  >
    <div class="modal">
      <p>Connect a wallet</p>
      <Connect />
     <div class="modal-close-btn"> <button @click="closeModal" class="close-btn">Close</button></div>
    </div>
  </div>
</template>
  
  <script>
import Connect from '../dashboard/Connect.vue';
export default {
  components: {
    Connect,
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>
  
  <style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 320px;
}
.modal-close-btn{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}
.modal-close-btn .close-btn{
  min-width: 125px
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background: #0056b3;
}
</style>
  