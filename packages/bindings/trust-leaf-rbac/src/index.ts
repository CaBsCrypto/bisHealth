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




export type DataKey = {tag: "Initialized", values: void} | {tag: "RoleMember", values: readonly [string, string]};




export interface Client {
  /**
   * Construct and simulate a init transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  init: ({admin}: {admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a has_role transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  has_role: ({role, account}: {role: string, account: string}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a grant_role transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  grant_role: ({admin, role, account}: {admin: string, role: string, account: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a revoke_role transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  revoke_role: ({admin, role, account}: {admin: string, role: string, account: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a role_constants transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  role_constants: (options?: MethodOptions) => Promise<AssembledTransaction<Map<string, string>>>

  /**
   * Construct and simulate a require_role_holder transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  require_role_holder: ({role, account}: {role: string, account: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAAAAAAAAAAAC0luaXRpYWxpemVkAAAAAAEAAAAAAAAAClJvbGVNZW1iZXIAAAAAAAIAAAARAAAAEw==",
        "AAAABQAAAAAAAAAAAAAACUluaXRFdmVudAAAAAAAAAIAAAAPdHJ1c3RfbGVhZl9yYmFjAAAAAARpbml0AAAAAgAAAAAAAAAEcm9sZQAAABEAAAABAAAAAAAAAAdhY2NvdW50AAAAABMAAAABAAAAAg==",
        "AAAAAAAAAAAAAAAEaW5pdAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=",
        "AAAABQAAAAAAAAAAAAAADkdyYW50Um9sZUV2ZW50AAAAAAACAAAAD3RydXN0X2xlYWZfcmJhYwAAAAAFZ3JhbnQAAAAAAAADAAAAAAAAAARyb2xlAAAAEQAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAEAAAAAAAAAB2FjY291bnQAAAAAEwAAAAEAAAAC",
        "AAAAAAAAAAAAAAAIaGFzX3JvbGUAAAACAAAAAAAAAARyb2xlAAAAEQAAAAAAAAAHYWNjb3VudAAAAAATAAAAAQAAAAE=",
        "AAAABQAAAAAAAAAAAAAAD1Jldm9rZVJvbGVFdmVudAAAAAACAAAAD3RydXN0X2xlYWZfcmJhYwAAAAAGcmV2b2tlAAAAAAADAAAAAAAAAARyb2xlAAAAEQAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAEAAAAAAAAAB2FjY291bnQAAAAAEwAAAAEAAAAC",
        "AAAAAAAAAAAAAAAKZ3JhbnRfcm9sZQAAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAARyb2xlAAAAEQAAAAAAAAAHYWNjb3VudAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAALcmV2b2tlX3JvbGUAAAAAAwAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAARyb2xlAAAAEQAAAAAAAAAHYWNjb3VudAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAOcm9sZV9jb25zdGFudHMAAAAAAAAAAAABAAAD7AAAABEAAAAR",
        "AAAAAAAAAAAAAAATcmVxdWlyZV9yb2xlX2hvbGRlcgAAAAACAAAAAAAAAARyb2xlAAAAEQAAAAAAAAAHYWNjb3VudAAAAAATAAAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    init: this.txFromJSON<null>,
        has_role: this.txFromJSON<boolean>,
        grant_role: this.txFromJSON<null>,
        revoke_role: this.txFromJSON<null>,
        role_constants: this.txFromJSON<Map<string, string>>,
        require_role_holder: this.txFromJSON<null>
  }
}