<script setup>
import { computed } from 'vue';
import { useAccount, useDisconnect } from '@wagmi/vue';
import PopperTooltip from '@/components/poppers/popper-tooltip.vue';
import iconSwitch from '../icons/icon-switch.vue';
import { useNotification } from '@kyvg/vue3-notification';

const notification = useNotification();
const { address } = useAccount();
const { disconnect } = useDisconnect();

console.log(address, "addressfgggfg")

const formattedAddress = computed(() => {
  if (!address.value) return null;
  return `${address.value.slice(0, 6)}…${address.value.slice(38, 42)}`;
});

const handleDisconnect = async () => {
  try {
     disconnect();
    const Msg = 'Wallet disconnected succesfully';
    notification.notify({
      title: 'Disconnected',
      text: Msg,
      type: 'success',
      duration: 2000,
      speed: 1000,
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
</style>