<script setup>
import { useConnect, useChainId } from '@wagmi/vue';
import { ref, watch, defineEmits } from 'vue';
import IconMetamask from '../icons/icon-metamask.vue';
import IconCoinbase from '../icons/icon-coinbase.vue';
import IconTrustWallet from '../icons/icon-trust-wallet.vue';
import IconWalletConnect from '../icons/icon-wallet-connect.vue';

const chainId = useChainId();
const { connectors, connect } = useConnect();
const emit = defineEmits(['walletConnected']);
watch(chainId, async (newChainId, oldChainId) => {
  console.log('HERE IS CHAIN IDs ', newChainId, oldChainId);
});

const walletComponents = {
  MetaMask: IconMetamask,
  WalletConnect: IconWalletConnect,
  'Trust Wallet': IconTrustWallet,
  'Coinbase Wallet': IconCoinbase,
  'Coinbase Wallet SDK': IconCoinbase,
  'MetaMask SDK': IconMetamask,
};



const excludedIds = new Set([
  'io.metamask',
  'com.coinbase.wallet',
  'com.trustwallet.app',
]);
const extensionConnectors = connectors.filter((connector) =>
  excludedIds.has(connector.id) || connector.id === 'walletConnect'
);

const sdkConnectors = connectors.filter((connector) =>
  (connector.id.includes('SDK') || connector.id === 'walletConnect') && !excludedIds.has(connector.id)
);
const filteredConnectors = extensionConnectors.length > 1 ? extensionConnectors : sdkConnectors;

const updatedConnectors = filteredConnectors.map((connector) => {
  if (connector.id.includes('SDK')) {
    return { ...connector, name: `${connector.name} SDK` };
  }
  return connector;
});



const handleConnect = async (connector) => {
  await connect({ connector, chainId });
  emit('walletConnected');
};
</script>

<template>
  <div class="connector-list">
    <button
      v-for="connector in updatedConnectors"
      :key="connector.id"
      @click="handleConnect(connector)"
      class="connector-button"
    >
      <component
        :is="walletComponents[connector.name]"
        class="wallet-icon"
      />
      {{ connector.name }}
    </button>
  </div>
</template>

<style scoped>
.connector-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.connector-button {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border: none;
  background-color: #fff;
  cursor: pointer;
  text-align: center;
}

.connector-button:hover {
  background-color: rgba(34, 34, 34, 0.07);
}

.connector-button {
  background-color: rgb(249, 249, 249);
  border-bottom: 2px solid #ffffff;
}

.wallet-icon {
  width: 40px;
  height: 40px;
  object-fit: cover;
  margin-right: 10px;
  border: 1px solid rgba(34, 34, 34, 0.07);
  border-radius: 12px;
}
</style>