<template>
  <div
    v-if="isVisible"
    class="modal-overlay"
    @click.self="hideModal"
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
        <button
          class="modal-button connect-wallet"
          @click="connectWallet"
        >
          Connect Wallet
        </button>
        <!-- <div class="divider">OR LOGIN</div>
            <input type="email" placeholder="Enter your email..." class="email-input"/>
            <button class="modal-button email-login">Email Login</button>
            <div class="social-logins">
              <button class="social-button google">G</button>
              <button class="social-button twitter">T</button>
              <button class="social-button discord">D</button>
            </div> -->
      </div>
    </div>
  </div>
</template>
    
  <script>
import { createWeb3Modal } from '@web3modal/wagmi';
import { reconnect, http, createConfig } from '@wagmi/core';
import { mainnet, sepolia } from '@wagmi/core/chains';
import { coinbaseWallet, walletConnect, injected } from '@wagmi/connectors';
export default {
  name: 'WalletModal',
  props: {
    isVisible: Boolean,
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
      const config = createConfig({
        chains: [mainnet, sepolia],
        transports: {
          [mainnet.id]: http(),
          [sepolia.id]: http(),
        },
        connectors: [
          walletConnect({ projectId, metadata, showQrModal: false }),
          injected({ shimDisconnect: true }),
          coinbaseWallet({
            appName: metadata.name,
            appLogoUrl: metadata.icons[0],
          }),
        ],
      });
      reconnect(config);
      const web3Modal = createWeb3Modal({
        wagmiConfig: config,
        projectId,
        enableAnalytics: true,
        enableOnramp: true,
      });
      const provider = await web3Modal.open();
      const address = web3Modal.getWalletInfo()

      // if (window.ethereum) {
      //   try {
      //     const accounts = await window.ethereum.request({
      //       method: 'eth_requestAccounts',
      //     });
      //     // console.log('Connected account:', accounts[0]);
      //   } catch (error) {
      //     console.error('Error connecting to wallet:', error);
      //   }
      // }
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
}

.modal {
  width: 30%;
  min-width: 320px;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.modal-header {
  background-color: #4b4b4b; /* A placeholder color, adjust as needed */
  color: #fff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-description {
  color: #666;
  text-align: center;
  padding: 20px 0;
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-button {
  margin: 10px 0;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  color: #fff;
  background-color: #6258e6; /* A placeholder color, adjust as needed */
  cursor: pointer;
  width: 80%;
  text-align: center;
}
</style>
  
  
    