import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Button, Container, Grid, TextField } from '@mui/material';
import QrCodeScanner from '@/app/components/QRCodeScanner';
import { useSearchParams } from 'next/navigation';

export default function Users() {
  const searchParams = useSearchParams();
  const socket = useRef();
  const [targetAddress, setTargetAddress] = useState(
    searchParams.get('targetAddress')
  );
  const [attestationUid, setAttestationUid] = useState('');
  const [privateDataProof, setPrivateDataProof] = useState('');

  const handleQrCodeSuccess = (decodedText: string) => {
    const url = new URL(decodedText);
    const params = new URLSearchParams(url.search);
    if (!!params.get('targetAddress')) {
      setTargetAddress(params.get('targetAddress'));
    }
  };

  const handleProofSubmit = () => {
    if (socket.current) {
      // @ts-ignore
      socket.current.emit('send-proof', {
        attestationUid,
        proof: privateDataProof,
      });
    }
  };

  useEffect(() => {
    const socketInitializer = async () => {
      // awaking the socket server
      await fetch(`/api/socket`);
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
      <Container maxWidth="md">
        {!targetAddress ? (
          <Grid container justifyContent="center">
            <Grid xs={4} item>
              <QrCodeScanner
                title="Start scanning the url"
                qrCodeSuccessCallback={handleQrCodeSuccess}
              />
            </Grid>
          </Grid>
        ) : (
          <Container>
            <Grid container justifyContent="center">
              <TextField
                id="outlined-multiline-static"
                label="Attestation UID"
                placeholder="Your Attestation UID"
                onChange={(e) => setAttestationUid(e.target.value)}
              />
            </Grid>
            <Grid container justifyContent="center">
              <TextField
                id="outlined-multiline-static"
                label="Proof"
                multiline
                rows={4}
                placeholder="Your Proof"
                onChange={(e) => setPrivateDataProof(e.target.value)}
              />
            </Grid>
            <Grid container justifyContent="center">
              <Button onClick={handleProofSubmit}>Submit</Button>
            </Grid>
          </Container>
        )}
      </Container>
    </main>
  );
}
