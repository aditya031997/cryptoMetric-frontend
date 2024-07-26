<script setup>
import { useConnect, useChainId } from '@wagmi/vue';
import { ref, watch,defineEmits } from 'vue';
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

const desiredConnectors = [
  'MetaMask',
  'WalletConnect',
  'Trust Wallet',
  'Coinbase Wallet',
];
const walletComponents = {
  MetaMask: IconMetamask,
  WalletConnect: IconWalletConnect,
  'Trust Wallet': IconTrustWallet,
  'Coinbase Wallet': IconCoinbase,
};

const filteredConnectors = connectors.filter(
  (connector) => connector.id !== 'metaMaskSDK'
);
const uniqueConnectors = filteredConnectors
  .filter((connector) => desiredConnectors.includes(connector.name))
  .reduce((acc, current) => {
    const x = acc.find((item) => item.name === current.name);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  const handleConnect = async (connector) => {
  await connect({ connector, chainId });
  emit('walletConnected');
};
</script>

<template>
  <div class="connector-list">
    <button
      v-for="connector in uniqueConnectors"
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