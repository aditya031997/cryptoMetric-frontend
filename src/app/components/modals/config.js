import { http, createConfig } from '@wagmi/vue'
import { base, mainnet, polygon, bsc, avalanche } from '@wagmi/vue/chains'
import {  metaMask, coinbaseWallet, walletConnect } from '@wagmi/vue/connectors'
import {infuraId } from "../../../configs/configs"
const projectId = 'db4b7494837843777ef2fdecef3d6f17'
export const config = createConfig({
  chains: [mainnet,bsc, polygon, base , avalanche],
  connectors: [
    walletConnect({ projectId }),
    metaMask(),
    coinbaseWallet(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http(),
    [avalanche.id]: http(),
  },
})