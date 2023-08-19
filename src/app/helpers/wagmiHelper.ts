import { type PublicClient, type WalletClient } from '@wagmi/core';
import { providers } from 'ethers';
import { type HttpTransport } from 'viem';
import { useEffect, useState } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    );
  return new providers.JsonRpcProvider(transport.url, network);
}

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);

  return signer;
}

export function useSigner() {
  const { data: walletClient } = useWalletClient();

  const [signer, setSigner] = useState<providers.JsonRpcSigner | undefined>(
    undefined
  );
  useEffect(() => {
    async function getSigner() {
      if (!walletClient) return;

      const tmpSigner = walletClientToSigner(walletClient);

      setSigner(tmpSigner);
    }

    getSigner();
  }, [walletClient]);
  return signer;
}

export function useProvider() {
  const publicClient = usePublicClient();

  const [provider, setProvider] = useState<
    providers.JsonRpcProvider | undefined
  >(undefined);
  useEffect(() => {
    async function getSigner() {
      if (!publicClient) return;

      const tmpProvider = publicClientToProvider(publicClient);

      setProvider(tmpProvider as providers.JsonRpcProvider);
    }

    getSigner();
  }, [publicClient]);
  return provider;
}
