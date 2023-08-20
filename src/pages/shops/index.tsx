import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { Grid, Typography } from '@mui/material';

export default function Shops() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const [isRedirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      setRedirecting(true);
      router.push(`/shops/${address}`);
    }
  }, [isConnected, address, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Grid container justifyContent="center">
        <Grid xs={12} item>
          <Typography variant="h5">
            Connect your wallet to get started
          </Typography>
        </Grid>
        {isRedirecting && (
          <Grid xs={12} item>
            <Typography variant="h6">Redirecting...</Typography>
          </Grid>
        )}
      </Grid>
    </main>
  );
}
