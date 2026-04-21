import "server-only";

import {
  Horizon,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
  type FeeBumpTransaction,
} from "@stellar/stellar-sdk";

import { buildSponsoredFeeBump } from "./sponsor";

const DEFAULT_TESTNET_HORIZON_URL = "https://horizon-testnet.stellar.org";
const DEFAULT_MAINNET_HORIZON_URL = "https://horizon.stellar.org";

export async function runSponsorSmokeTest(args: {
  sponsorSecretKey: string | null;
  networkPassphrase: string;
  baseFee: string;
  requestedBy: string;
}) {
  if (!args.sponsorSecretKey) {
    throw new Error("TRUST_LEAF_SPONSOR_SECRET_KEY is not configured");
  }

  const signerSecretKey = process.env.TRUST_LEAF_SMOKE_SIGNER_SECRET_KEY ?? args.sponsorSecretKey;
  const signerKeypair = Keypair.fromSecret(signerSecretKey);
  const sponsorKeypair = Keypair.fromSecret(args.sponsorSecretKey);
  const horizon = new Horizon.Server(
    process.env.TRUST_LEAF_HORIZON_URL ?? defaultHorizonUrl(args.networkPassphrase),
  );
  const signerAccount = await horizon.loadAccount(signerKeypair.publicKey());
  const smokeKey = `tl-smoke-${Date.now().toString(36)}`;
  const smokeValue = `${args.requestedBy.slice(0, 20)}-${Math.random().toString(36).slice(2, 8)}`;

  const innerTransaction = new TransactionBuilder(signerAccount, {
    fee: "100",
    networkPassphrase: args.networkPassphrase,
  })
    .addOperation(
      Operation.manageData({
        name: smokeKey,
        value: smokeValue,
        source: signerKeypair.publicKey(),
      }),
    )
    .setTimeout(30)
    .build();

  innerTransaction.sign(signerKeypair);

  const sponsorship = buildSponsoredFeeBump({
    innerXdr: innerTransaction.toXDR(),
    sponsorSecretKey: args.sponsorSecretKey,
    networkPassphrase: args.networkPassphrase,
    baseFee: args.baseFee,
  });

  if (!sponsorship.feeBumpXdr) {
    throw new Error(sponsorship.reason ?? "Unable to build sponsored fee bump");
  }

  const feeBumpTransaction = TransactionBuilder.fromXDR(
    sponsorship.feeBumpXdr,
    args.networkPassphrase,
  ) as FeeBumpTransaction;
  const submission = await horizon.submitTransaction(feeBumpTransaction);

  return {
    ...sponsorship,
    smoke: {
      sourceAccount: signerKeypair.publicKey(),
      signerStrategy:
        signerSecretKey === args.sponsorSecretKey ? "sponsor-self-signed" : "dedicated-smoke-signer",
      horizonUrl: process.env.TRUST_LEAF_HORIZON_URL ?? defaultHorizonUrl(args.networkPassphrase),
      operation: "manageData",
      smokeKey,
      smokeValue,
      submitted: submission.successful,
      hash: submission.hash,
      ledger: "ledger" in submission ? submission.ledger ?? null : null,
      resultXdr: submission.result_xdr ?? null,
    },
    innerXdr: innerTransaction.toXDR(),
  };
}

function defaultHorizonUrl(networkPassphrase: string) {
  return networkPassphrase === Networks.PUBLIC
    ? DEFAULT_MAINNET_HORIZON_URL
    : DEFAULT_TESTNET_HORIZON_URL;
}
