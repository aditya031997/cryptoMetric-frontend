<template>
  <div
    v-if="isVisible"
    class="modal-overlay"
    @click="hideModal"
  >
    <div
      class="modal"
      @click.stop
    >
      <div class="modal-header">
        <h2>Connect & Login</h2>
        <span
          class="close"
          @click="hideModal"
          >&times;</span
        >
      </div>
      <div class="modal-body">
        <p class="modal-description">
          Connect with your web3 wallet to trade instantly, then verify or login
          with your email or social account for full access.
        </p>
        <div
          class=""
          style="width: 100%"
        >
          <button
            class="modal-button connect-wallet"
            @click="connectWallet"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
    
  <script>
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { reconnect, http } from '@wagmi/core';
import {
  mainnet,
  polygon,
  bsc,
  sepolia,
  avalanche,
  base,
} from '@wagmi/core/chains';
// import { coinbaseWallet, walletConnect, metaMask, injected } from '@wagmi/connectors';
import { watchAccount } from '@wagmi/core';

export default {
  name: 'WalletModal',
  props: {
    isVisible: Boolean,
  },
  data() {
    return {
      walletAddress: null,
    };
  },
  methods: {
    hideModal() {
      this.$emit('hide-modal');
    },
    async connectWallet() {
      const projectId = 'db4b7494837843777ef2fdecef3d6f17';
      const metadata = {
        name: 'Web3Modal',
        description: 'Web3Modal Example',
        url: 'https://web3modal.com',
        icons: ['https://avatars.githubusercontent.com/u/37784886'],
      };
      const chains = [mainnet, sepolia, bsc, polygon, avalanche, base];
      const config = defaultWagmiConfig({
        chains,
        metadata,
        projectId,
        transports: {
          [mainnet.id]: http(),
          [sepolia.id]: http(),
          [polygon.id]: http(),
          [bsc.id]: http(),
        },
      });
      reconnect(config);
      const web3Modal = createWeb3Modal({
        wagmiConfig: config,
        projectId,
        enableAnalytics: true,
        enableOnramp: true,
      });
      await web3Modal.open();
      web3Modal.getWalletInfo();
      const handleAccountChange = (data) => {
        this.walletAddress = data.address;
        localStorage.setItem('walletAddress', data.address);
        this.$emit('account-changed', data.address);
        this.hideModal();
      };

      watchAccount(config, {
        onChange: handleAccountChange.bind(this),
      });
    },
  },
};
</script>
   <style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9;
}
.close {
  cursor: pointer;
  color: #000;
  font-size: 30px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 15px;
  right: 15px;
}
.modal {
  width: 35%;
  min-width: 320px;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.modal-header {
  color: #000;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid transparent;
  padding: 0;
  margin-bottom: 15px;

  h2 {
    font-size: 28px;
    margin-bottom: 0;
  }
}

.modal-description {
  color: #666;
  font-size: 15px;
  // text-align: center;
  // padding: 20px 0;
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
}

.modal-button {
  margin: 10px 0;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: #fff;
  background-color: #01b7ff;
  font-weight: 600;
  cursor: pointer;
  display: block;
}
</style>
  
  
    