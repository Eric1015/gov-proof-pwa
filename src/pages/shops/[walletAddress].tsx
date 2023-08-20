import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import WalletConnect from '@/app/components/WalletConnect';
import { Button, Container, Grid, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import QRCode from 'react-qr-code';
import {
  MerkleMultiProof,
  verifyMultiProof,
} from '@/app/helpers/merkleTreeHelper';
import useEASProvider from '@/app/hooks/useEASProvider';
import Image from 'next/image';

export default function ShopDetail() {
  const router = useRouter();
  const { walletAddress = '' } = router.query;
  const { isConnected, address } = useAccount();
  const { getAttestationByUid, createUserVerifiedAttestation } =
    useEASProvider();
  const socket = useRef();
  const [currentUrl, setCurrentUrl] = useState(
    typeof window !== 'undefined' ? window.location.host : ''
  );
  const [attestationUid, setAttestationUid] = useState('');
  const [providedPrivateDataProof, setProvidedPrivateDataProof] =
    useState<MerkleMultiProof>();
  const [imageUrl, setImageUrl] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [attestationExpiredIn, setAttestationExpiredIn] = useState(10);
  const [generatedAttestationUid, setGeneratedAttestationUid] = useState('');

  const handleGrantUserAccessClick = async () => {
    const generatedAttestationUid = await createUserVerifiedAttestation(
      recipientAddress,
      attestationExpiredIn
    );
    setGeneratedAttestationUid(generatedAttestationUid);
  };

  const extractImageUrlFromProof = (proof: MerkleMultiProof) => {
    const imageLeaves = proof.leaves.filter((leaf) => leaf.name === 'imageUrl');
    if (!imageLeaves.length) {
      return '';
    }
    return imageLeaves[0].value;
  };

  useEffect(() => {
    setCurrentUrl(`${window.location.host}?targetAddress=${address}`);
  }, [address]);

  useEffect(() => {
    const socketInitializer = async () => {
      if (address) {
        // awaking the socket server
        await fetch(`/api/socket`);
        const newSocket = io();

        newSocket.on('connect', () => {
          console.log('connected');
        });
        newSocket.on(
          'receive-proof',
          async (msg: { attestationUid: string; proof: string }) => {
            console.log(msg);
            const attestation = await getAttestationByUid(msg.attestationUid);
            const proof = JSON.parse(msg.proof) as MerkleMultiProof;
            const rootHash = attestation?.data;
            if (!rootHash) {
              return;
            }
            console.log(attestation);
            setRecipientAddress(attestation?.recipient);
            const verificationResult = await verifyMultiProof(proof, rootHash);
            if (verificationResult) {
              setImageUrl(extractImageUrlFromProof(proof));
            }
          }
        );
        // @ts-ignore
        socket.current = newSocket;
      }
    };

    socketInitializer();
  }, [address, getAttestationByUid]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Container maxWidth="md">
        <Grid container justifyContent="center">
          <Grid xs={4} item>
            <QRCode
              size={256}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={currentUrl}
              viewBox={`0 0 256 256`}
            />
          </Grid>
        </Grid>
        {imageUrl && (
          <Grid container>
            <Grid container justifyContent="center">
              <Grid xs={4} item>
                <Image
                  src={imageUrl}
                  alt="profile image"
                  height={200}
                  width={200}
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="center">
              <Grid xs={4} item>
                <TextField
                  label="Expire duration (min)"
                  placeholder="Expire in"
                  defaultValue={10}
                  type="number"
                  onChange={(event) =>
                    setAttestationExpiredIn(Number(event.target.value))
                  }
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="center">
              <Grid xs={4} item>
                <Button onClick={handleGrantUserAccessClick}>
                  Grant User Access
                </Button>
              </Grid>
            </Grid>
            {generatedAttestationUid && (
              <Grid container justifyContent="center">
                <Grid xs={4} item>
                  <p>{generatedAttestationUid}</p>
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </main>
  );
}
