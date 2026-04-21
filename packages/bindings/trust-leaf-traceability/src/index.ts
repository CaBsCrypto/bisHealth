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




export type DataKey = {tag: "Batch", values: readonly [Buffer]} | {tag: "Event", values: readonly [Buffer, u32]} | {tag: "EventCount", values: readonly [Buffer]};


export interface PlantEvent {
  batch_id: Buffer;
  document_hash: Buffer;
  event_type: string;
}

export type BatchStatus = {tag: "Created", values: void} | {tag: "InTesting", values: void} | {tag: "Released", values: void} | {tag: "Recalled", values: void};


export interface CannabisBatch {
  batch_id: Buffer;
  cultivator: string;
  lab: Option<string>;
  latest_document_hash: Buffer;
  metadata_hash: Buffer;
  status: BatchStatus;
}





export interface Client {
  /**
   * Construct and simulate a get_batch transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_batch: ({batch_id}: {batch_id: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<CannabisBatch>>

  /**
   * Construct and simulate a get_event transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_event: ({batch_id, event_id}: {batch_id: Buffer, event_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<PlantEvent>>

  /**
   * Construct and simulate a assign_lab transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  assign_lab: ({cultivator, batch_id, lab}: {cultivator: string, batch_id: Buffer, lab: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a append_event transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  append_event: ({actor, batch_id, event_type, document_hash}: {actor: string, batch_id: Buffer, event_type: string, document_hash: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a create_batch transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_batch: ({cultivator, batch_id, metadata_hash}: {cultivator: string, batch_id: Buffer, metadata_hash: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a update_status transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_status: ({actor, batch_id, status, document_hash}: {actor: string, batch_id: Buffer, status: BatchStatus, document_hash: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_event_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_event_count: ({batch_id}: {batch_id: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

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
      new ContractSpec([ "AAAAAAAAAAAAAAAJZ2V0X2JhdGNoAAAAAAAAAQAAAAAAAAAIYmF0Y2hfaWQAAAPuAAAAIAAAAAEAAAfQAAAADUNhbm5hYmlzQmF0Y2gAAAA=",
        "AAAAAAAAAAAAAAAJZ2V0X2V2ZW50AAAAAAAAAgAAAAAAAAAIYmF0Y2hfaWQAAAPuAAAAIAAAAAAAAAAIZXZlbnRfaWQAAAAEAAAAAQAAB9AAAAAKUGxhbnRFdmVudAAA",
        "AAAAAAAAAAAAAAAKYXNzaWduX2xhYgAAAAAAAwAAAAAAAAAKY3VsdGl2YXRvcgAAAAAAEwAAAAAAAAAIYmF0Y2hfaWQAAAPuAAAAIAAAAAAAAAADbGFiAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAMYXBwZW5kX2V2ZW50AAAABAAAAAAAAAAFYWN0b3IAAAAAAAATAAAAAAAAAAhiYXRjaF9pZAAAA+4AAAAgAAAAAAAAAApldmVudF90eXBlAAAAAAAQAAAAAAAAAA1kb2N1bWVudF9oYXNoAAAAAAAD7gAAACAAAAAA",
        "AAAAAAAAAAAAAAAMY3JlYXRlX2JhdGNoAAAAAwAAAAAAAAAKY3VsdGl2YXRvcgAAAAAAEwAAAAAAAAAIYmF0Y2hfaWQAAAPuAAAAIAAAAAAAAAANbWV0YWRhdGFfaGFzaAAAAAAAA+4AAAAgAAAAAA==",
        "AAAAAAAAAAAAAAANdXBkYXRlX3N0YXR1cwAAAAAAAAQAAAAAAAAABWFjdG9yAAAAAAAAEwAAAAAAAAAIYmF0Y2hfaWQAAAPuAAAAIAAAAAAAAAAGc3RhdHVzAAAAAAfQAAAAC0JhdGNoU3RhdHVzAAAAAAAAAAANZG9jdW1lbnRfaGFzaAAAAAAAA+4AAAAgAAAAAA==",
        "AAAAAAAAAAAAAAAPZ2V0X2V2ZW50X2NvdW50AAAAAAEAAAAAAAAACGJhdGNoX2lkAAAD7gAAACAAAAABAAAABA==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAwAAAAEAAAAAAAAABUJhdGNoAAAAAAAAAQAAA+4AAAAgAAAAAQAAAAAAAAAFRXZlbnQAAAAAAAACAAAD7gAAACAAAAAEAAAAAQAAAAAAAAAKRXZlbnRDb3VudAAAAAAAAQAAA+4AAAAg",
        "AAAAAQAAAAAAAAAAAAAAClBsYW50RXZlbnQAAAAAAAMAAAAAAAAACGJhdGNoX2lkAAAD7gAAACAAAAAAAAAADWRvY3VtZW50X2hhc2gAAAAAAAPuAAAAIAAAAAAAAAAKZXZlbnRfdHlwZQAAAAAAEA==",
        "AAAAAgAAAAAAAAAAAAAAC0JhdGNoU3RhdHVzAAAAAAQAAAAAAAAAAAAAAAdDcmVhdGVkAAAAAAAAAAAAAAAACUluVGVzdGluZwAAAAAAAAAAAAAAAAAACFJlbGVhc2VkAAAAAAAAAAAAAAAIUmVjYWxsZWQ=",
        "AAAAAQAAAAAAAAAAAAAADUNhbm5hYmlzQmF0Y2gAAAAAAAAGAAAAAAAAAAhiYXRjaF9pZAAAA+4AAAAgAAAAAAAAAApjdWx0aXZhdG9yAAAAAAATAAAAAAAAAANsYWIAAAAD6AAAABMAAAAAAAAAFGxhdGVzdF9kb2N1bWVudF9oYXNoAAAD7gAAACAAAAAAAAAADW1ldGFkYXRhX2hhc2gAAAAAAAPuAAAAIAAAAAAAAAAGc3RhdHVzAAAAAAfQAAAAC0JhdGNoU3RhdHVzAA==",
        "AAAABQAAAAAAAAAAAAAAEExhYkFzc2lnbmVkRXZlbnQAAAACAAAAF3RydXN0X2xlYWZfdHJhY2VhYmlsaXR5AAAAAAxsYWJfYXNzaWduZWQAAAADAAAAAAAAAAhiYXRjaF9pZAAAA+4AAAAgAAAAAQAAAAAAAAAKY3VsdGl2YXRvcgAAAAAAEwAAAAEAAAAAAAAAA2xhYgAAAAATAAAAAQAAAAI=",
        "AAAABQAAAAAAAAAAAAAAEUJhdGNoQ3JlYXRlZEV2ZW50AAAAAAAAAgAAABd0cnVzdF9sZWFmX3RyYWNlYWJpbGl0eQAAAAANYmF0Y2hfY3JlYXRlZAAAAAAAAAMAAAAAAAAACGJhdGNoX2lkAAAD7gAAACAAAAABAAAAAAAAAApjdWx0aXZhdG9yAAAAAAATAAAAAQAAAAAAAAANbWV0YWRhdGFfaGFzaAAAAAAAA+4AAAAgAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAAElN0YXR1c1VwZGF0ZWRFdmVudAAAAAAAAgAAABd0cnVzdF9sZWFmX3RyYWNlYWJpbGl0eQAAAAAOc3RhdHVzX3VwZGF0ZWQAAAAAAAQAAAAAAAAACGJhdGNoX2lkAAAD7gAAACAAAAABAAAAAAAAAAVhY3RvcgAAAAAAABMAAAABAAAAAAAAAAZzdGF0dXMAAAAAB9AAAAALQmF0Y2hTdGF0dXMAAAAAAAAAAAAAAAANZG9jdW1lbnRfaGFzaAAAAAAAA+4AAAAgAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAAFEJhdGNoRXZlbnRBZGRlZEV2ZW50AAAAAgAAABd0cnVzdF9sZWFmX3RyYWNlYWJpbGl0eQAAAAALYmF0Y2hfZXZlbnQAAAAABAAAAAAAAAAIYmF0Y2hfaWQAAAPuAAAAIAAAAAEAAAAAAAAAC2V2ZW50X2luZGV4AAAAAAQAAAABAAAAAAAAAApldmVudF90eXBlAAAAAAAQAAAAAAAAAAAAAAANZG9jdW1lbnRfaGFzaAAAAAAAA+4AAAAgAAAAAAAAAAI=" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_batch: this.txFromJSON<CannabisBatch>,
        get_event: this.txFromJSON<PlantEvent>,
        assign_lab: this.txFromJSON<null>,
        append_event: this.txFromJSON<null>,
        create_batch: this.txFromJSON<null>,
        update_status: this.txFromJSON<null>,
        get_event_count: this.txFromJSON<u32>
  }
}