import Ably from 'ably/promises';

// @ts-ignore
export default async function handler(_, res) {
  const client = new Ably.Realtime(process.env.ABLY_API_KEY || '');
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: 'GovProof',
  });
  res.status(200).json(tokenRequestData);
}
