import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import WalletConnect from '@/app/components/WalletConnect';
import { Button, Container, Grid, TextField } from '@mui/material';
import QrCodeScanner from '@/app/components/QRCodeScanner';

export default function Home() {
  const socket = useRef();
  const [targetAddress, setTargetAddress] = useState(
    '0xf6Bb54Bab66E7Db19Cf71341e23B8D4b4f0aaBBB'
  );
  const [qrCodeData, setQrCodeData] = useState('');
  const [privateDataProof, setPrivateDataProof] = useState('');

  const handleQrCodeSuccess = (decodedText: string) => {
    setQrCodeData(decodedText);
    console.log(decodedText);
  };

  const handleProofSubmit = () => {
    if (socket.current) {
      // @ts-ignore
      socket.current.emit('send-proof', {
        targetAddress,
        privateDataProof,
      });
    }
  };

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch(`/api/socket/${targetAddress}`);
      const newSocket = io();

      newSocket.on('connect', () => {
        console.log('connected');
      });
      // @ts-ignore
      socket.current = newSocket;
    };

    socketInitializer();
  }, [targetAddress]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <WalletConnect />
        <Container maxWidth="md">
          <Grid container justifyContent="center">
            <Grid xs={4} item>
              <QrCodeScanner qrCodeSuccessCallback={handleQrCodeSuccess} />
            </Grid>
          </Grid>
          <p>{qrCodeData}</p>
          <TextField
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            rows={4}
            placeholder="Your Proof"
          />
          <Button onClick={handleProofSubmit}>Submit</Button>
        </Container>
      </div>
    </main>
  );
}
