import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import {
  Button,
  Container,
  Grid,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import QRCode from 'react-qr-code';
import {
  MerkleMultiProof,
  verifyMultiProof,
} from '@/app/helpers/merkleTreeHelper';
import useEASProvider from '@/app/hooks/useEASProvider';
import UserInformation from '@/app/components/UserInformation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShopQRCodeModal from '@/app/components/ShopQRCodeModal';

export default function ShopDetail() {
  const router = useRouter();
  const { walletAddress = '' } = router.query;
  const { isConnected, address: connectedWalletAddress } = useAccount();
  const { getAttestationByUid, createUserVerifiedAttestation } =
    useEASProvider();
  const socket = useRef();
  const [currentUrl, setCurrentUrl] = useState(
    typeof window !== 'undefined' ? window.location.host : ''
  );
  const [attestationUid, setAttestationUid] = useState('');
  const [providedPrivateDataProof, setProvidedPrivateDataProof] =
    useState<MerkleMultiProof>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [isAdult, setAdult] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [attestationExpiredIn, setAttestationExpiredIn] = useState(10);
  const [generatedAttestationUid, setGeneratedAttestationUid] = useState('');
  const [isProofVerificationFinished, setProofVerificationFinished] =
    useState(false);
  const [proofVerificationResult, setProofVerificationResult] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const handleGrantUserAccessClick = async () => {
    const generatedAttestationUid = await createUserVerifiedAttestation(
      recipientAddress,
      attestationExpiredIn
    );
    setGeneratedAttestationUid(generatedAttestationUid);
  };

  const extractAttributeFromProof = (
    proof: MerkleMultiProof,
    attributeName: string
  ) => {
    const imageLeaves = proof.leaves.filter(
      (leaf) => leaf.name === attributeName
    );
    if (!imageLeaves.length) {
      return '';
    }
    return imageLeaves[0].value;
  };

  useEffect(() => {
    if (
      walletAddress &&
      connectedWalletAddress &&
      walletAddress !== connectedWalletAddress
    ) {
      router.push(`/shops/${connectedWalletAddress}`);
    }
  }, [walletAddress, connectedWalletAddress, router]);

  useEffect(() => {
    setCurrentUrl(
      `https://${window.location.host}?targetAddress=${connectedWalletAddress}`
    );
  }, [connectedWalletAddress]);

  useEffect(() => {
    const socketInitializer = async () => {
      if (connectedWalletAddress) {
        // awaking the socket server
        await fetch(`/api/socket`);
        const newSocket = io();

        newSocket.on('connect', () => {
          console.log('connected');
        });
        newSocket.on(
          'receive-proof',
          async (msg: { attestationUid: string; proof: string }) => {
            const attestation = await getAttestationByUid(msg.attestationUid);
            const proof = JSON.parse(msg.proof) as MerkleMultiProof;
            const rootHash = attestation?.data;
            if (!rootHash) {
              return;
            }
            setRecipientAddress(attestation?.recipient);
            const verificationResult = await verifyMultiProof(proof, rootHash);
            if (verificationResult) {
              setFirstName(extractAttributeFromProof(proof, 'firstName'));
              setLastName(extractAttributeFromProof(proof, 'lastName'));
              setDateOfBirth(extractAttributeFromProof(proof, 'dateOfBirth'));
              setAddress(extractAttributeFromProof(proof, 'address'));
              setAdult(extractAttributeFromProof(proof, 'isAdult'));
              setImageUrl(extractAttributeFromProof(proof, 'imageUrl'));
            }
            setProofVerificationResult(verificationResult);
            setProofVerificationFinished(true);
          }
        );
        // @ts-ignore
        socket.current = newSocket;
      }
    };

    socketInitializer();
  }, [connectedWalletAddress, getAttestationByUid]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Container maxWidth="md">
        {!isProofVerificationFinished ? (
          <Grid container justifyContent="center">
            <Grid container item>
              <Grid item>
                <Typography variant="body1" sx={{ m: 2 }}>
                  {'Open QR code for users to scan and provide proof'}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item sx={{ m: 2 }}>
              <Grid item>
                <Button variant="contained" onClick={() => setShowQrCode(true)}>
                  QR Code
                </Button>
              </Grid>
            </Grid>
            <Grid container item>
              <Grid item>
                <Typography variant="body1" sx={{ m: 2 }}>
                  {"Waiting for user's proof ..."}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            spacing={2}
            justifyContent="center"
            sx={{
              marginTop: 8,
            }}
          >
            {proofVerificationResult && (
              <Grid container item spacing={1}>
                <Grid item>
                  <CheckCircleIcon color="success" />
                </Grid>
                <Grid item>
                  <Typography
                    variant="body1"
                    color="success"
                    sx={{ color: '#2e7d32' }}
                  >
                    Verified
                  </Typography>
                </Grid>
              </Grid>
            )}
            <Grid item>
              <UserInformation
                firstName={firstName}
                lastName={lastName}
                isAdult={isAdult}
                imageUrl={imageUrl}
                address={address}
                dateOfBirth={dateOfBirth}
              />
            </Grid>
            <Grid container item>
              <Grid xs={4} item>
                <TextField
                  label="User access expire duration (min)"
                  fullWidth
                  placeholder="Expire in"
                  defaultValue={10}
                  type="number"
                  onChange={(event) =>
                    setAttestationExpiredIn(Number(event.target.value))
                  }
                />
              </Grid>
            </Grid>
            <Grid container item>
              <Grid xs={4} item>
                <Button
                  variant="contained"
                  onClick={handleGrantUserAccessClick}
                >
                  Grant User Access
                </Button>
              </Grid>
            </Grid>
            {generatedAttestationUid && (
              <Grid container item justifyContent="center">
                <Grid xs={4} item>
                  <p>{generatedAttestationUid}</p>
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
      <ShopQRCodeModal
        isOpen={showQrCode}
        onClose={() => setShowQrCode(false)}
        qrCodeUrl={currentUrl}
      />
    </main>
  );
}
