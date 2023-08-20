import HeaderWrapper from '@/app/layouts/HeaderWrapper';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';

import { Web3Modal } from '@web3modal/react';
import { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#154C79',
    },
    secondary: {
      main: '#fff',
      contrastText: '#4f4f4f',
      light: '#fff',
      dark: '#ddd',
    },
  },
});

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

const supportedChains = [sepolia];

const { publicClient } = configureChains(supportedChains, [
  w3mProvider({ projectId }),
]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains: supportedChains }),
  publicClient,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiConfig, supportedChains);

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <WagmiConfig config={wagmiConfig}>
          <HeaderWrapper>
            <Component {...pageProps} />
          </HeaderWrapper>
        </WagmiConfig>

        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </ThemeProvider>
    </>
  );
}

export default App;
