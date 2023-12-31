import { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Grid,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import QrCodeScanner from '@/app/components/QRCodeScanner';
import { useSearchParams } from 'next/navigation';
import useToast from '@/app/hooks/useToast';
import Toast from '@/app/components/Toast';
import useAblyChannel from '@/app/hooks/useAblyChannel';

export default function Users() {
  const searchParams = useSearchParams();
  const { isToastOpen, severity, message, closeToast, openToast } = useToast();
  const [targetAddress, setTargetAddress] = useState(
    searchParams.get('targetAddress')
  );
  const [attestationUid, setAttestationUid] = useState('');
  const [privateDataProof, setPrivateDataProof] = useState('');
  const [verifiedAttestationUrl, setVerifiedAttestationUrl] = useState('');

  const [channel] = useAblyChannel('transfer-proof', (_) => {});

  useAblyChannel('transfer-verified-attestation', (msg) => {
    const data = msg.data;
    setVerifiedAttestationUrl(
      `https://sepolia.easscan.org/attestation/view/${data.attestationUid}`
    );
  });

  const handleQrCodeSuccess = (decodedText: string) => {
    const url = new URL(decodedText);
    const params = new URLSearchParams(url.search);
    if (!!params.get('targetAddress')) {
      setTargetAddress(params.get('targetAddress'));
    }
  };

  const handleProofSubmit = () => {
    // @ts-ignore
    channel.publish({
      name: 'send-proof',
      data: {
        attestationUid,
        proof: privateDataProof,
      },
    });
    openToast('Successfully sent proof', 'success');
  };

  useEffect(() => {
    setTargetAddress(searchParams.get('targetAddress'));
  }, [searchParams]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="md">
          {!targetAddress ? (
            <Grid container justifyContent="center" spacing={2}>
              <Grid xs={12} item container justifyContent="center">
                <Grid item>
                  <Typography variant="body1">
                    Which shop do you want to provide your proof to?
                  </Typography>
                </Grid>
              </Grid>
              <Grid xs={8} md={4} item>
                <QrCodeScanner
                  title="Start scanning QR code"
                  qrCodeSuccessCallback={handleQrCodeSuccess}
                />
              </Grid>
            </Grid>
          ) : (
            <Box>
              <Grid container spacing={2}>
                <Grid container item justifyContent="center" margin="normal">
                  <Typography variant="h6">
                    Get your proof information from EAS scan:{' '}
                    <a
                      href="https://sepolia.easscan.org/attestations"
                      target="_blank"
                    >
                      link
                    </a>
                  </Typography>
                </Grid>
                <Grid container item justifyContent="center" margin="normal">
                  <TextField
                    required
                    fullWidth
                    id="outlined-multiline-static"
                    label="Attestation UID"
                    placeholder="Your Attestation UID"
                    onChange={(e) => setAttestationUid(e.target.value)}
                  />
                </Grid>
                <Grid container item justifyContent="center" margin="normal">
                  <TextField
                    required
                    fullWidth
                    id="outlined-multiline-static"
                    label="Proof"
                    multiline
                    rows={4}
                    placeholder="Your Proof"
                    onChange={(e) => setPrivateDataProof(e.target.value)}
                  />
                </Grid>
                <Grid container item justifyContent="center" margin="normal">
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleProofSubmit}
                  >
                    Submit
                  </Button>
                </Grid>
                {verifiedAttestationUrl && (
                  <Grid container item justifyContent="center" margin="normal">
                    <Typography variant="h6">
                      Verified Attestation:{' '}
                      <a
                        href={verifiedAttestationUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        link
                      </a>
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </Container>
        <Toast
          isToastOpen={isToastOpen}
          severity={severity}
          message={message}
          closeToast={closeToast}
        />
      </Box>
    </main>
  );
}
