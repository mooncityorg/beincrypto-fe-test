import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import { argentWallet, trustWallet, ledgerWallet } from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    {
      id: 80001,
      name: 'Polygon Mumbai',
      network: 'maticmum',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: {
        alchemy: {
          http: ['https://polygon-mumbai.g.alchemy.com/v2'],
          webSocket: ['wss://polygon-mumbai.g.alchemy.com/v2'],
        },
        infura: {
          http: ['https://polygon-mumbai.infura.io/v3'],
          webSocket: ['wss://polygon-mumbai.infura.io/ws/v3'],
        },
        default: {
          http: ['https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78'],
        },
        public: {
          http: ['https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78'],
        },
      },
      blockExplorers: {
        etherscan: {
          name: 'PolygonScan',
          url: 'https://mumbai.polygonscan.com',
        },
        default: {
          name: 'PolygonScan',
          url: 'https://mumbai.polygonscan.com',
        },
      },
      contracts: {
        multicall3: {
          address: '0xca11bde05977b3631167028862be2a173976ca11',
          blockCreated: 25770160,
        },
      },
      testnet: true,
    },
  ],
  [publicProvider()]
);

const projectId = 'YOUR_PROJECT_ID';

const { wallets } = getDefaultWallets({
  appName: 'RainbowKit demo',
  projectId,
  chains,
});

const demoAppInfo = {
  appName: 'Rainbowkit Demo',
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function WalletConnect({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider appInfo={demoAppInfo} chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default WalletConnect;
