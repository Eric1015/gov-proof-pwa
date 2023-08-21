import { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Grid,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import {
  MerkleMultiProof,
  verifyMultiProof,
} from '@/app/helpers/merkleTreeHelper';
import useEASProvider from '@/app/hooks/useEASProvider';
import UserInformation from '@/app/components/UserInformation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GppBadIcon from '@mui/icons-material/GppBad';
import ShopQRCodeModal from '@/app/components/ShopQRCodeModal';
import useAblyChannel from '@/app/hooks/useAblyChannel';

export default function ShopDetail() {
  const router = useRouter();
  const { walletAddress = '' } = router.query;
  const { address: connectedWalletAddress } = useAccount();
  const { getAttestationByUid, createUserVerifiedAttestation } =
    useEASProvider();
  const [currentUrl, setCurrentUrl] = useState(
    typeof window !== 'undefined' ? window.location.host : ''
  );
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
  const [isCreatingAttestation, setIsCreatingAttestation] = useState(false);

  useAblyChannel('transfer-proof', async (msg: any) => {
    const data = msg.data;
    const attestation = await getAttestationByUid(data.attestationUid);
    const proof = JSON.parse(data.proof) as MerkleMultiProof;
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
  });

  const [channel] = useAblyChannel('transfer-verified-attestation', (_) => {});

  const handleGrantUserAccessClick = async () => {
    try {
      setIsCreatingAttestation(true);
      const generatedAttestationUid = await createUserVerifiedAttestation(
        recipientAddress,
        attestationExpiredIn
      );
      setGeneratedAttestationUid(generatedAttestationUid);
      // @ts-ignore
      channel.publish({
        name: 'send-verified-attestation',
        data: { attestationUid: generatedAttestationUid },
      });
    } finally {
      setIsCreatingAttestation(false);
    }
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
      `https://${window.location.host}/users?targetAddress=${connectedWalletAddress}`
    );
  }, [connectedWalletAddress]);

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
              mt: 4,
              pl: 5,
              pr: 5,
            }}
          >
            {proofVerificationResult ? (
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
            ) : (
              <Grid container item spacing={1}>
                <Grid item>
                  <GppBadIcon color="error" />
                </Grid>
                <Grid item>
                  <Typography
                    variant="body1"
                    color="error"
                    sx={{ color: '#f4c7c3' }}
                  >
                    Not matching
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
              <Grid item>
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
              <Grid item>
                <LoadingButton
                  loading={isCreatingAttestation}
                  disabled={!proofVerificationResult}
                  variant="contained"
                  onClick={handleGrantUserAccessClick}
                >
                  Grant User Access
                </LoadingButton>
              </Grid>
            </Grid>
            {generatedAttestationUid && (
              <Grid container item>
                <Grid item>
                  <Typography variant="body2">
                    {'Generated Attestation: '}
                    <a
                      href={`https://sepolia.easscan.org/attestation/view/${generatedAttestationUid}`}
                      target="_blank"
                    >
                      link
                    </a>
                  </Typography>
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
