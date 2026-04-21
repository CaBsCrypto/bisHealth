# Trust Leaf Indexer

This package now contains a vendor-neutral event projector for Trust Leaf. It is designed so the same normalization and projection logic can sit behind either:

- Mercury / Zephyr ingestion for Stellar-native event indexing.
- A future custom worker or queue consumer that replays Soroban events into PostgreSQL.
- A later Subsquid-style pipeline if official Stellar support is mature enough for the MVP deployment target.

The key idea is to keep the business projections deterministic and independent from the ingestion vendor.

## Package commands

- `npm install`
- `npm run build`
- `npm run check`
- `npm run demo`
- `npm run demo:rpc`
- `npm run ingest:rpc`

## Read models to produce

- cultivator batch dashboard
- batch detail timeline
- doctor-issued prescriptions
- dispensary verification history
- patient private activity feed

## Event design goals

- compact payloads
- deterministic ids
- role-aware projections
- easy replay and backfill
- ingestion-vendor portability

## Contract event contract

### `trust_leaf_rbac`

- `("trust_leaf_rbac", "grant", role, admin, account)` -> no extra payload
- `("trust_leaf_rbac", "revoke", role, admin, account)` -> no extra payload
- `("trust_leaf_rbac", "init", "ADMIN", account)` -> no extra payload

### `trust_leaf_traceability`

- `("trust_leaf_traceability", "batch_created", batch_id, cultivator)` -> `{ metadata_hash }`
- `("trust_leaf_traceability", "lab_assigned", batch_id, cultivator, lab)` -> no extra payload
- `("trust_leaf_traceability", "batch_event", batch_id, event_index)` -> `{ event_type, document_hash }`
- `("trust_leaf_traceability", "status_updated", batch_id, actor)` -> `{ status, document_hash }`

### `trust_leaf_zk_medical`

- `("trust_leaf_zk_medical", "prescription_issued", commitment, doctor, patient_nullifier)` -> `{ policy_hash }`
- `("trust_leaf_zk_medical", "prescription_consumed", commitment, caller, patient_nullifier)` -> no extra payload

## Intended processor responsibilities

1. Materialize the latest batch snapshot.
2. Store each batch event by deterministic `(batch_id, event_index)`.
3. Keep prescription issuance and consumption as separate read concerns.
4. Derive role membership snapshots for admin dashboards.
5. Feed frontend views with latency-safe indexed reads.
6. Allow full replay from raw Soroban events without bespoke state hydration.

## Suggested package layout

- `src/processor.ts`: stream Soroban events and dispatch handlers
- `src/mappings/rbac.ts`: role grant/revoke projections
- `src/mappings/traceability.ts`: batch and timeline projections
- `src/mappings/zkMedical.ts`: prescription and verification projections
- `src/model.ts`: in-memory projection shapes mirrored by GraphQL entities
- `src/types.ts`: raw event envelopes and normalized Trust Leaf event union
- `src/demo.ts`: local replay example for quick sanity checks

## UI-facing queries

- latest batches for cultivator dashboard
- single batch with ordered timeline
- doctor-issued prescriptions by wallet/account
- dispensary verification attempts
- patient-safe receipt status by nullifier alias

## Current implementation notes

- `schema.graphql` reflects the current read models expected by the app layer.
- `src/mappings/*` contains pure projection logic by bounded context.
- `src/demo.ts` gives us a cheap local replay loop before wiring a managed indexer.
- `src/adapters/stellarRpc.ts` decodes `getEvents` base64 `ScVal` payloads through the official Stellar SDK.
- `src/ingest/rpcIngest.ts` persists a polling cursor and replays fetched events into the same projector layer.
- The next integration step is to point `ingest:rpc` at deployed contract IDs on testnet or mainnet.

## RPC ingestion env vars

- `TRUST_LEAF_RPC_URL`: Stellar RPC endpoint
- `TRUST_LEAF_CONTRACT_IDS`: comma-separated Trust Leaf contract IDs
- `TRUST_LEAF_START_LEDGER`: optional start ledger for first sync
- `TRUST_LEAF_END_LEDGER`: optional end ledger for bounded backfills
- `TRUST_LEAF_PAGE_LIMIT`: optional page size
- `TRUST_LEAF_MAX_PAGES`: optional page count per run
- `TRUST_LEAF_CURSOR_FILE`: optional cursor state path
- `TRUST_LEAF_OUTPUT_FILE`: optional snapshot output path

If `TRUST_LEAF_START_LEDGER` is omitted on a first run, the ingestor now defaults to ledger `1`.
If `TRUST_LEAF_OUTPUT_FILE` already exists, the ingestor hydrates that snapshot first and only applies new events on top, so repeated polling runs preserve the full read model.
