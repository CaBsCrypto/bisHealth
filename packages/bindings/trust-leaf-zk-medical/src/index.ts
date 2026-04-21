import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}




export type DataKey = {tag: "Prescription", values: readonly [Buffer]} | {tag: "Nullifier", values: readonly [Buffer]};


export interface Prescription {
  commitment: Buffer;
  doctor: string;
  is_used: boolean;
  patient_nullifier: Buffer;
  policy_hash: Buffer;
}



export interface Client {
  /**
   * Construct and simulate a get_prescription transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_prescription: ({commitment}: {commitment: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<Prescription>>

  /**
   * Construct and simulate a issue_prescription transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  issue_prescription: ({doctor, commitment, patient_nullifier, policy_hash}: {doctor: string, commitment: Buffer, patient_nullifier: Buffer, policy_hash: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a verify_and_consume transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  verify_and_consume: ({caller, commitment, proof, public_inputs_hash}: {caller: string, commitment: Buffer, proof: Buffer, public_inputs_hash: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAEAAAAAAAAADFByZXNjcmlwdGlvbgAAAAEAAAPuAAAAIAAAAAEAAAAAAAAACU51bGxpZmllcgAAAAAAAAEAAAPuAAAAIA==",
        "AAAAAQAAAAAAAAAAAAAADFByZXNjcmlwdGlvbgAAAAUAAAAAAAAACmNvbW1pdG1lbnQAAAAAA+4AAAAgAAAAAAAAAAZkb2N0b3IAAAAAABMAAAAAAAAAB2lzX3VzZWQAAAAAAQAAAAAAAAARcGF0aWVudF9udWxsaWZpZXIAAAAAAAPuAAAAIAAAAAAAAAALcG9saWN5X2hhc2gAAAAD7gAAACA=",
        "AAAABQAAAAAAAAAAAAAAF1ByZXNjcmlwdGlvbklzc3VlZEV2ZW50AAAAAAIAAAAVdHJ1c3RfbGVhZl96a19tZWRpY2FsAAAAAAAAE3ByZXNjcmlwdGlvbl9pc3N1ZWQAAAAABAAAAAAAAAAKY29tbWl0bWVudAAAAAAD7gAAACAAAAABAAAAAAAAAAZkb2N0b3IAAAAAABMAAAABAAAAAAAAABFwYXRpZW50X251bGxpZmllcgAAAAAAA+4AAAAgAAAAAQAAAAAAAAALcG9saWN5X2hhc2gAAAAD7gAAACAAAAAAAAAAAg==",
        "AAAABQAAAAAAAAAAAAAAGVByZXNjcmlwdGlvbkNvbnN1bWVkRXZlbnQAAAAAAAACAAAAFXRydXN0X2xlYWZfemtfbWVkaWNhbAAAAAAAABVwcmVzY3JpcHRpb25fY29uc3VtZWQAAAAAAAADAAAAAAAAAApjb21taXRtZW50AAAAAAPuAAAAIAAAAAEAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAEAAAAAAAAAEXBhdGllbnRfbnVsbGlmaWVyAAAAAAAD7gAAACAAAAABAAAAAg==",
        "AAAAAAAAAAAAAAAQZ2V0X3ByZXNjcmlwdGlvbgAAAAEAAAAAAAAACmNvbW1pdG1lbnQAAAAAA+4AAAAgAAAAAQAAB9AAAAAMUHJlc2NyaXB0aW9u",
        "AAAAAAAAAAAAAAASaXNzdWVfcHJlc2NyaXB0aW9uAAAAAAAEAAAAAAAAAAZkb2N0b3IAAAAAABMAAAAAAAAACmNvbW1pdG1lbnQAAAAAA+4AAAAgAAAAAAAAABFwYXRpZW50X251bGxpZmllcgAAAAAAA+4AAAAgAAAAAAAAAAtwb2xpY3lfaGFzaAAAAAPuAAAAIAAAAAA=",
        "AAAAAAAAAAAAAAASdmVyaWZ5X2FuZF9jb25zdW1lAAAAAAAEAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAACmNvbW1pdG1lbnQAAAAAA+4AAAAgAAAAAAAAAAVwcm9vZgAAAAAAA+4AAAAgAAAAAAAAABJwdWJsaWNfaW5wdXRzX2hhc2gAAAAAA+4AAAAgAAAAAQAAAAE=" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_prescription: this.txFromJSON<Prescription>,
        issue_prescription: this.txFromJSON<null>,
        verify_and_consume: this.txFromJSON<boolean>
  }
}