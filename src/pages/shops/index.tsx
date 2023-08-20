import { useEffect } from 'react';
import WalletConnect from '@/app/components/WalletConnect';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { Typography } from '@mui/material';

export default function Shops() {
  const router = useRouter();
  const { isConnected, address } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      router.push(`/shops/${address}`);
    }
  }, [isConnected, address, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Typography variant="h3">Connect your wallet to get started</Typography>
      <WalletConnect />
    </main>
  );
}
