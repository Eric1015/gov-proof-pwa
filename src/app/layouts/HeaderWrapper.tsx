import { Box, AppBar, Toolbar, Typography, Button, Grid } from '@mui/material';
import Image from 'next/image';
import logo from '@public/logo/logo-192.png';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { Web3Button } from '@web3modal/react';

type Props = {
  children: React.ReactNode;
};

const HeaderWrapper = ({ children }: Props) => {
  const { isConnected } = useAccount();

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Box display="flex" flexGrow={1}>
              <Grid container alignItems="center">
                <Grid item>
                  <Link href="/">
                    <Image src={logo} alt="logo" height={60} />
                  </Link>
                </Grid>
                <Grid item>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                    color="white"
                  >
                    GovProof
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            {isConnected && <Web3Button icon="show" label="Connect" />}
          </Toolbar>
        </AppBar>
      </Box>
      {children}
    </div>
  );
};

export default HeaderWrapper;
