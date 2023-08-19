import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { Web3Button, Web3NetworkSwitch } from '@web3modal/react';

function WalletConnect() {
  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid xs={4} item>
          <Web3Button icon="show" label="Connect Wallet" balance="show" />
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <Grid xs={4} item>
          <Web3NetworkSwitch />
        </Grid>
      </Grid>
    </Container>
  );
}

export default WalletConnect;
