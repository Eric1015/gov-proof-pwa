### GovProof

GovProof leverages the Ethereum Attestation Service ([link](https://docs.attest.sh/docs/welcome)) to offer a streamlined and secure method of personal information verification for both consumers and service providers. Upon arrival at a participating location, customers scan a QR code and choose the personal information they wish to share for verification. Once verified, service providers can create an attestation for the user, allowing re-entry within a specified time frame without needing to re-verify.

Built as part of the ETHToronto hackathon: https://dorahacks.io/hackathon/ethtoronto2023/buidl

Dorahacks BUIDL url: https://dorahacks.io/buidl/6804

* Demo video:
<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe src="https://www.loom.com/embed/606d9ee79ea149e7bebc3da68e0d6389?sid=38553b9b-5873-4153-a466-9b24cc03ecd3" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>


## Getting Started

Currently, only Sepolia testnet is accepted in this application.

Create an account on Ably to get the API key for the web socket connection: [link](https://www.ably.io/)

Create an account on WalletConnet to get the project id for the wallet connect provider: [link](https://cloud.walletconnect.com/)

Install dependencies, configuration, and run the development server:

The schema that I used for the verified schema is: [link](https://sepolia.easscan.org/schema/view/0x0be8952e2dd74ffd63a02f4d55b20b603fe7a60130cb9d70de31feb9c52fdd37)

```bash
yarn install

cp .env.example .env.local
# fill in the .env.local file with your own values

yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

You can create private data attestation with this schema: [link](https://sepolia.easscan.org/schema/view/0x20351f973fdec1478924c89dfa533d8f872defa108d9c3c6512267d7e7e5dbc2)

For other network urls, please visit the EAS official document: [link](https://docs.attest.sh/docs/tutorials/private-data-attestations#private-data-attestation-tutorial)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
