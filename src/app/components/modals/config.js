import { http, createConfig } from '@wagmi/vue'
import { base, mainnet, polygon, bsc, avalanche } from '@wagmi/vue/chains'
import { injected, metaMask, safe, walletConnect } from '@wagmi/vue/connectors'
import {infuraId } from "../../../configs/configs"

export const config = createConfig({
  chains: [mainnet,bsc, polygon, base , avalanche],
  connectors: [
    injected(),
    walletConnect({ infuraId }),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http(),
    [avalanche.id]: http(),
  },
})