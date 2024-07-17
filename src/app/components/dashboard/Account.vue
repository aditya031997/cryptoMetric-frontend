<script setup>
import { computed, watch, onMounted } from 'vue';
import { useAccount, useDisconnect } from '@wagmi/vue';
import PopperTooltip from '@/components/poppers/popper-tooltip.vue';
import iconSwitch from '../icons/icon-switch.vue';
import { useNotification } from '@kyvg/vue3-notification';

const notification = useNotification();
const { address, isConnected } = useAccount();
const { disconnect } = useDisconnect();

const formattedAddress = computed(() => {
  if (!address.value) return null;
  return `${address.value.slice(0, 6)}…${address.value.slice(38, 42)}`;
});

// Function to update localStorage
const updateLocalStorage = () => {

  localStorage.setItem('walletAddress', isConnected._object.address);
  localStorage.setItem('chainId', isConnected._object.chainId);
  localStorage.setItem('walletName', isConnected._object.connector.name);
};

// Watch for changes in isConnected
watch(
  () => isConnected.value,
  (newIsConnected) => {
    updateLocalStorage();
  },
  { immediate: true }
);

// Also update localStorage on component mount
onMounted(() => {
  updateLocalStorage();
});

const handleDisconnect = async () => {
  try {
    await disconnect();
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletName');
    localStorage.removeItem('chainId')

    const Msg = 'Wallet disconnected successfully';
    notification.notify({
      title: 'Disconnected',
      text: Msg,
      type: 'success',
      duration: 2000,
      speed: 1000,
      position: 'top right',
      classes: 'custom-notification',
    });
  } catch (error) {
    console.error('Error disconnecting:', error);
  }
};
</script>

<template>
  <div class="head-log">
    <button @click="handleDisconnect">
      <popper-tooltip
        custom-class="header-logout"
        placement="bottom"
        :disabled="isDnd || poppersOff"
      >
        <iconSwitch />
        <template v-slot:popper>Disconnect</template>
      </popper-tooltip>
    </button>
    <div class="header-dashboard__connected-address">
      <div class="address-box">
        <figure>
          <img
            src="../../assets/images/img-avatar.png"
            alt=""
          />
        </figure>
        <div>{{ formattedAddress }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.head-log {
  display: flex;
  gap: 8px;
}

.custom-notification {
  margin-top: 20px;
}
</style>