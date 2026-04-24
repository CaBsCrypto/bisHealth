# Trust Leaf Data Flow

## Source of truth split

### On-chain

- role membership proofs
- batch anchors and status transitions
- prescription commitments and consumption state

### Off-chain

- encrypted medical data
- cultivation media and large documents
- passkey session state
- fee sponsorship orchestration

## Golden path data movement

1. Cultivator uploads evidence to off-chain storage.
2. Frontend computes a content hash and submits only the anchor to `trust_leaf_traceability`.
3. Soroban emits a compact event.
4. Subsquid consumes the event and updates batch snapshots and timelines.
5. Doctor issues a prescription commitment through `trust_leaf_zk_medical`.
6. Patient device derives public signals, generates a proof, and packs a verifier envelope.
7. Soroban marks the prescription as consumed.
8. Indexer updates checkout history and patient-safe receipt state.

## Why this matters for UX

- The frontend reads snapshots from the indexer instead of waiting on repeated chain queries.
- Optimistic UI can render local success immediately and reconcile once indexed confirmation lands.
- Supabase or PostgreSQL objects are never trusted unless their hash matches the chain anchor.
