import "server-only";

import { Keypair, TransactionBuilder } from "@stellar/stellar-sdk";

export type SponsoredFeeBumpResult = {
  mode: "mock" | "fee-bump";
  sponsored: boolean;
  feeSource: string | null;
  feeBumpXdr: string | null;
  networkPassphrase: string;
  reason?: string;
};

export function buildSponsoredFeeBump(args: {
  innerXdr: string;
  sponsorSecretKey: string | null;
  networkPassphrase: string;
  baseFee: string;
}): SponsoredFeeBumpResult {
  const parsedTransaction = TransactionBuilder.fromXDR(args.innerXdr, args.networkPassphrase);

  if ("innerTransaction" in parsedTransaction) {
    throw new Error("innerXdr must not already be fee bumped");
  }

  if (!args.sponsorSecretKey) {
    return {
      mode: "mock",
      sponsored: false,
      feeSource: null,
      feeBumpXdr: null,
      networkPassphrase: args.networkPassphrase,
      reason: "TRUST_LEAF_SPONSOR_SECRET_KEY is not configured",
    };
  }

  const sponsorKeypair = Keypair.fromSecret(args.sponsorSecretKey);
  const feeBumpTransaction = TransactionBuilder.buildFeeBumpTransaction(
    sponsorKeypair,
    args.baseFee,
    parsedTransaction,
    args.networkPassphrase,
  );

  feeBumpTransaction.sign(sponsorKeypair);

  return {
    mode: "fee-bump",
    sponsored: true,
    feeSource: sponsorKeypair.publicKey(),
    feeBumpXdr: feeBumpTransaction.toXDR(),
    networkPassphrase: args.networkPassphrase,
  };
}
