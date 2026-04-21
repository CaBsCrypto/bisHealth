# Trust Leaf

Trust Leaf is a privacy-preserving trust layer for the medicinal cannabis supply chain on Stellar/Soroban.

This repository is structured as a product monorepo so the team can iterate through the MVP "golden path":

1. Cultivator registers and traces a cannabis batch.
2. Doctor issues a private medical prescription commitment.
3. Patient proves eligibility with a ZK proof.
4. Dispensary validates the proof and completes a checkout flow.

## Product pillars

- Public product traceability.
- Private patient identity.
- Wallet-less UX through passkeys and smart accounts.
- Gas-less transactions through sponsored fee bumping.
- Fast UX through indexed blockchain reads instead of direct chain polling.

## Repository layout

- `contracts/`: Soroban smart contracts for access control, traceability, and ZK medical flows.
- `zk/`: Off-chain circuit and prover integration scaffolding.
- `indexer/`: Subsquid-oriented indexing schemas and processor scaffold.
- `apps/web/`: Next.js frontend for doctor, cultivator, patient, and dispensary flows.
- `docs/`: Architecture notes, trust model, and phased roadmap.

## Delivery phases

### Phase 1

Soroban core contracts and Rust unit tests.

### Phase 2

Zero-knowledge circuit and on-chain verifier integration.

### Phase 3

Indexer setup for low-latency UX reads.

### Phase 4

Wallet-less frontend with passkeys, optimistic UI, and fee sponsoring.

### Phase 5

Defindex payment integration for asset abstraction at checkout.

## Current status

The repository now includes:

- Soroban contracts for RBAC, traceability, and ZK medical verification.
- A Circom + Groth16 prover flow aligned with Soroban BN254 verification.
- A vendor-neutral indexer projection layer for role, batch, and prescription read models.
- A frontend landing experience built around role portals, indexed read models, passkeys, and fee sponsorship scaffolding.
- Testnet deployment scripts for building, deploying, and initializing the three core contracts.
- A live traceability batch, a reserved prescription, and a consumed fixture prescription already executed on Stellar testnet.
- A current Stellar ecosystem integration matrix in `docs/ecosystem-integrations.md`.
- A live testnet deployment manifest with real contract ids.
- Local workspace sync tooling that propagates live testnet ids into the frontend and indexer env files.
- A cumulative indexed snapshot that can be refreshed incrementally without losing prior read-model state.

## Current blockers

- The passkey flow is still WebAuthn-first scaffolding rather than a fully wired Stellar smart-wallet deployment path.
- The patient-generated proof path is still fixture-backed for the live demo; the full mobile witness/prover loop remains to be finished.
- Checkout and DeFindex still remain an unfinished final phase.
