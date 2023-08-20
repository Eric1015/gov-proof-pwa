import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { useCallback, useEffect, useState } from 'react';
import { useSigner } from '@/app/helpers/wagmiHelper';

const EASContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'; // Sepolia v0.26
const privateDataSchemaUid =
  process.env.NEXT_PUBLIC_EAS_PRIVATE_DATA_SCHEMA_UID || '';

const verifiedUserSchemaUid =
  process.env.NEXT_PUBLIC_EAS_VERIFIED_USER_SCHEMA_UID || '';

const useEASProvider = () => {
  const [easClient, setEasClient] = useState<EAS | null>(null);
  const signer = useSigner();

  const createAttestation = useCallback(
    async (
      schemaUid: string,
      recipient: string,
      encodedData: string,
      expirationTime = BigInt(0)
    ): Promise<string> => {
      if (!easClient) {
        return '';
      }

      const tx = await easClient.attest({
        schema: schemaUid,
        data: {
          recipient,
          expirationTime,
          revocable: true, // Be aware that if your schema is not revocable, this MUST be false
          data: encodedData,
        },
      });

      return await tx.wait();
    },
    [easClient]
  );

  const createUserInfoAttestation = useCallback(
    async (
      recipient: string,
      isAdult: boolean,
      faceImageCid: string
    ): Promise<string> => {
      const schemaEncoder = new SchemaEncoder(
        'bool isAdult, string face_image_cid'
      );
      const encodedData = schemaEncoder.encodeData([
        { name: 'isAdult', value: isAdult, type: 'bool' },
        { name: 'face_image_cid', value: faceImageCid, type: 'string' },
      ]);
      return createAttestation(privateDataSchemaUid, recipient, encodedData);
    },
    [createAttestation]
  );

  const createUserVerifiedAttestation = useCallback(
    async (recipient: string, expiredAfterMinutes: number): Promise<string> => {
      const schemaEncoder = new SchemaEncoder('bool isVerified');
      const encodedData = schemaEncoder.encodeData([
        { name: 'isVerified', value: true, type: 'bool' },
      ]);
      const expirationTime = BigInt(
        expiredAfterMinutes * 60 + Math.floor(Date.now() / 1000)
      );
      return createAttestation(
        verifiedUserSchemaUid,
        recipient,
        encodedData,
        expirationTime
      );
    },
    [createAttestation]
  );

  const getAttestationByUid = useCallback(
    async (uid: string) => {
      if (!easClient) {
        console.log('No easClient');
        return null;
      }

      return await easClient.getAttestation(uid);
    },
    [easClient]
  );

  useEffect(() => {
    if (!easClient && signer) {
      // Initialize the sdk with the address of the EAS Schema contract address
      const eas = new EAS(EASContractAddress);

      // Connects an ethers style provider/signingProvider to perform read/write functions.
      // MUST be a signer to do write operations!
      // @ts-ignore
      eas.connect(signer);

      setEasClient(eas);
    }
  }, [easClient, signer]);

  return {
    createUserInfoAttestation,
    getAttestationByUid,
    createUserVerifiedAttestation,
  };
};

export default useEASProvider;
