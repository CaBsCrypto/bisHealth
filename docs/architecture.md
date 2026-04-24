# Trust Leaf Architecture

## Vision

Trust Leaf makes medicinal cannabis provenance publicly auditable while keeping the patient medically private.

The system splits trust into two distinct domains:

- **Public integrity domain**: cultivation, lab, and dispensary records are publicly attestable.
- **Private medical domain**: patient identity and prescription details remain off-chain or proven only through ZK commitments.

## Core modules

### 1. `trust_leaf_rbac`

Centralized contract-level role registry for ecosystem actors.

- `ADMIN`
- `DOCTOR_ROLE`
- `DISPENSARY_ROLE`
- `LAB_ROLE`
- `CULTIVATOR_ROLE`

Responsibilities:

- bootstrap administrator
- grant and revoke roles
- provide reusable authorization checks for higher-level workflows
- emit role change events for the indexer/backend audit trail

### 2. `trust_leaf_traceability`

Immutable registry of cannabis batches and lifecycle events.

Stores:

- batch ids
- producer and lab addresses
- status markers
- document hash references (`BytesN<32>`)
- compact per-event records keyed by index for deterministic replay

Does not store:

- raw medical files
- long text blobs
- images

### 3. `trust_leaf_zk_medical`

Private prescription commitment registry.

Stores:

- prescription commitment
- issuance metadata
- consumed flag
- verifier key reference or verification parameters pointer
- patient nullifier hash for one-time redemption protection

Execution flow:

1. Doctor creates a private prescription commitment.
2. Patient device generates a ZK proof off-chain.
3. Dispensary submits proof to `verify_and_consume`.
4. Contract verifies proof and marks the prescription as consumed.

## Off-chain stack

### Encrypted application data

Primary short-term recommendation:

- Supabase with an isolated `trustleaf` schema for rapid MVP velocity.

Ideal production path:

- PostgreSQL plus encrypted object storage.

Examples of off-chain records:

- plant photos
- cultivation notes
- encrypted doctor notes
- patient metadata
- checkout/session state

The UI must always compare the off-chain file hash against the on-chain hash anchor before treating a record as valid.

## Data access strategy

The web application should read historical views from an indexer, not from direct on-chain scans.

Recommended flow:

1. Contracts emit compact events.
2. Subsquid ingests those events.
3. The frontend queries indexed read models.
4. Chain state is used only for writes and critical verification.

## Wallet-less UX architecture

### Identity and signing

- Passkeys for user sign-in.
- Smart account abstraction for signing and policy enforcement.
- Fee bumping so the user never acquires or spends XLM directly.

### UX rules

- optimistic success state immediately after backend accepts the intent
- background confirmation polling through indexer/backend
- user-facing language should avoid blockchain terminology

## Security notes

- All privileged contract entrypoints must gate access with explicit auth checks.
- ZK verification must use Soroban host primitives rather than custom cryptography in contract code.
- Replay and double-spend protection must be explicit in `trust_leaf_zk_medical`.
- Off-chain encrypted data should never be trusted without verifying its on-chain hash anchor.
- Contract storage should prefer keyed records and counters over large append-only vectors.

## Delivery map

### Phase 1

Implement Soroban contracts and unit tests.

### Phase 2

Add Noir/Circom circuit and proof adapter boundary.

### Phase 3

Stand up indexer schemas and event consumers.

### Phase 4

Build frontend role portals, passkey auth, and sponsored transaction backend.

### Phase 5

Integrate Defindex-based checkout asset routing.
