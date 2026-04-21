# Stellar Ecosystem Integrations

This document is the practical answer to: "Which Stellar ecosystem tools are you using, and what is still pending?"

## Snapshot

Current Trust Leaf status is best described as:

- **Core architecture implemented**
- **Frontend and ecosystem rails partially integrated**
- **Not yet fully wired to live testnet contract ids**

Current rough score:

- **70 / 100** for a strong MVP / hackathon / grant narrative
- **not yet 100 / 100** for a live end-to-end testnet flow

## Clarifying the "etc"

When people mention things like:

- Soroswap
- wallet kit
- trustless
- passkeys
- fee bumping
- indexers

the word **"etc"** usually mixes together three different categories:

1. **Libraries or SDKs**
2. **Infrastructure/services**
3. **Architectural properties**

For Trust Leaf:

- **Soroswap** is a protocol/integration option
- **Passkey Kit / wallet kit** is an integration option
- **Mercury / Subsquid** are indexing or data access options
- **trustless** is not a package; it is a product property we aim to maximize in the public verification layer

## Integration matrix

| Integration / concept | Current status | How Trust Leaf uses it today | Where it appears in repo | What is still missing |
| --- | --- | --- | --- | --- |
| **Soroban smart contracts** | **Implemented** | Core business logic lives in three contracts: RBAC, traceability, and ZK medical verification | `contracts/trust_leaf_rbac`, `contracts/trust_leaf_traceability`, `contracts/trust_leaf_zk_medical` | Live testnet deployment and frontend/indexer wiring to real ids |
| **Stellar SDK** | **Implemented** | Used for XDR parsing, network configuration, and fee-bump construction | `apps/web/package.json`, `apps/web/app/lib/stellar/sponsor.ts` | Wire every frontend write flow to real contract invocations |
| **Sponsored fee bumping** | **Implemented in backend rail** | Backend can wrap inner transactions into fee-bump transactions so the user never pays fees directly | `apps/web/app/lib/stellar/sponsor.ts`, `apps/web/app/api/walletless/sponsor-fee/route.ts` | Use live signed inner XDRs from real contract actions instead of demo payloads |
| **Passkeys / WebAuthn** | **Implemented as MVP** | Registration, authentication, session restore, and wallet-less UX are already working through WebAuthn | `apps/web/app/api/walletless/passkey/*`, `apps/web/app/walletless/*` | Replace or extend MVP auth with live Stellar smart-wallet deployment/signing |
| **Passkey Kit / smart-wallet factory** | **Prepared but not live** | The app already exposes a readiness model for a contract-account smart-wallet flow | `apps/web/app/lib/stellar/passkeys.ts`, `GET /api/stellar/passkeys` | Real factory contract id, wallet wasm hash, and live signing/deployment integration |
| **DeFindex / PaltaLabs** | **Partially integrated** | Vault discovery, SDK health, deposit preview, and sponsored-deposit route are already wired | `apps/web/app/lib/defindex/*`, `apps/web/app/api/defindex/*` | Real API credentials, validated live checkout path, and end-to-end dispensary settlement |
| **BN254 host functions on Soroban** | **Implemented** | `trust_leaf_zk_medical` already uses Soroban BN254 primitives and pairing checks | `contracts/trust_leaf_zk_medical/src/lib.rs` | Connect production-ready proof artifacts and validate gas/instruction envelope on live testnet |
| **Circom proving path** | **Scaffolded** | Canonical MVP ZK backend path exists for proof generation and packing | `zk/circom`, `zk/circuits/prescription`, `zk/adapters/typescript` | Finalize witness derivation, proving pipeline, and contract-compatible proof handoff |
| **Noir proving path** | **Scaffolded / exploratory** | Maintained as a design sandbox for future circuit iteration | `zk/noir` | Decide whether Noir remains exploratory or becomes a first-class proving path |
| **Indexer via Stellar RPC** | **Implemented as vendor-neutral MVP path** | Contracts emit compact events, and a replayable projector ingests them through Stellar RPC | `indexer/src/adapters/stellarRpc.ts`, `indexer/src/ingest/rpcIngest.ts` | Point at real deployed contract ids and persist production-grade read models |
| **Mercury** | **Prepared, not wired** | Mercury is referenced as an optional future discovery/indexing rail | `apps/web/app/lib/stellar/passkeys.ts` | Actual Mercury endpoint and live data flow |
| **Subsquid** | **Conceptually supported, not live** | We intentionally kept the projection layer vendor-neutral so it can sit behind a future Subsquid-style pipeline | `indexer/README.md` | Actual Subsquid adapter or managed deployment once Stellar support fits MVP needs |
| **Launchtube / relayer** | **Prepared, not wired** | Exposed as an optional backend relay integration for smart-wallet flows | `apps/web/app/lib/stellar/passkeys.ts` | Real relayer endpoint and integration into transaction submission path |
| **Soroswap** | **Not used yet** | Not currently part of the checkout or settlement path | not present as a live dependency | Add only if asset routing or swap UX requires it beyond DeFindex |
| **OpenZeppelin Stellar patterns** | **Used as design reference** | Contract structure and modular security thinking follow OpenZeppelin-style patterns | architecture and contract design decisions | Swap from reference-only posture to direct generated modules only if needed |
| **Trustless verification** | **Product property, partially achieved** | Public product provenance is verifiable on-chain; patient privacy remains off-chain/ZK-protected | contracts + indexer + frontend trust views | Complete live contract wiring so the public verification layer becomes real, not simulated |

## What is already real today

The strongest concrete pieces already in place are:

1. **Three Soroban contracts**
2. **WebAuthn wallet-less patient flow**
3. **Fee-bump sponsorship backend**
4. **DeFindex backend integration scaffold**
5. **BN254 on-chain verifier logic**
6. **Vendor-neutral indexer pipeline**
7. **Bilingual premium frontend already deployed**

## What is still "partial"

These rails exist, but they are not yet fully upgraded to live testnet truth:

1. **Passkey-backed smart wallet deployment**
2. **Frontend writes against live contract ids**
3. **Indexer pointed at live contract events**
4. **DeFindex with final credentials and live partner path**
5. **End-to-end doctor -> patient -> dispensary happy path**

## What is not in use right now

If someone asks whether we already use these, the honest answer today is **no**:

1. **Soroswap**
2. **Mercury live indexing**
3. **Subsquid live deployment**
4. **Launchtube live relay**
5. **A fully official Wallet Kit / Passkey Kit production signing flow**

## Recommended short answer for pitches

Use this when someone asks:

> We already use Soroban contracts, the Stellar SDK, passkeys/WebAuthn, fee-bump sponsorship, BN254 verification on Soroban, a vendor-neutral Stellar event indexer, and DeFindex integration scaffolding.  
> We have Passkey Kit-style smart-wallet readiness designed in, but Mercury, Subsquid, Launchtube, and Soroswap are not yet fully live in the MVP.

## Current phase by workstream

| Workstream | Status |
| --- | --- |
| Soroban core contracts | **Advanced / mostly complete** |
| ZK verifier path | **Advanced but not production-closed** |
| Indexer | **Implemented, not yet pointed at live testnet ids** |
| Frontend | **Advanced** |
| Wallet-less UX | **Advanced MVP** |
| DeFindex checkout rail | **Partial** |
| Real testnet go-live | **Not complete yet** |

## Next steps that unlock the biggest jump

1. Deploy the three contracts for real and replace the current dry-run manifest.
2. Feed those contract ids into the frontend and indexer.
3. Run the first live doctor-issued prescription flow.
4. Submit a real patient proof and consume it on-chain.
5. Finish the first live DeFindex-assisted dispensary checkout path.
