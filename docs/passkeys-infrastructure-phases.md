# Trust Leaf Passkeys: 3-Phase Backend Plan

This roadmap keeps the passkey rail backend-first so the UI can evolve independently later.

## Phase 1: Stateless WebAuthn Backend

Goal:
- Make passkey registration and login reliable in testnet/Vercel.
- Keep UI and backend loosely coupled.

What exists now:
- Stateless registration/login challenges via signed flow tokens.
- Stateless session cookie via `TRUST_LEAF_SESSION_SECRET`.
- Reusable backend service layer in `apps/web/app/lib/passkeys/service.ts`.
- WebAuthn routes consume the service layer instead of embedding all logic directly in route files.

Current limitation:
- The user profile and passkey credential cache still live in browser storage on the current UI.
- This is acceptable for MVP/testnet demos, but not for production identity.

## Phase 2: Durable Identity Storage

Goal:
- Move passkey profile state out of the browser and into a durable backend store.

Needed:
- A database or durable service for:
  - users
  - credential public keys
  - counters
  - approval status
  - account metadata
- Backend repository abstraction behind the service layer
- Read/write APIs that any future UI can call

Recommended outputs:
- `profileStorage = durable-db`
- `backendPhase = 2`

MVP implementation path:
- Supabase with an isolated `trustleaf` schema inside the shared project
- backend service role through:
  - `TRUST_LEAF_SUPABASE_URL`
  - `TRUST_LEAF_SUPABASE_SERVICE_ROLE_KEY`
  - `TRUST_LEAF_SUPABASE_SCHEMA`
- passkey tables:
  - `trustleaf.passkey_users`
  - `trustleaf.passkey_credentials`

Definition of done:
- Login works across devices/browsers for the same account identity.
- Counter updates persist server-side.
- UI no longer depends on `localStorage` for passkey identity.

## Phase 3: Stellar Smart-Wallet Passkeys

Goal:
- Convert passkey identity into a real Stellar smart-wallet flow.

Needed:
- `TRUST_LEAF_PASSKEY_FACTORY_CONTRACT_ID`
- `TRUST_LEAF_PASSKEY_WALLET_WASM_HASH`
- relayer path such as `TRUST_LEAF_LAUNCHTUBE_URL`
- account lookup/indexing path such as `TRUST_LEAF_MERCURY_URL`
- `passkey-kit` runtime integration
- wallet deployment orchestration after registration

Definition of done:
- `integrationMode = passkey-kit-ready`
- Passkey registration can deploy/bind a contract account.
- Sponsored transactions flow through the same account identity.

## Why this split works

Benefits:
- Backend can stabilize before final UI polish.
- Future frontend teams can replace screens without rewriting the auth rail.
- Each phase has a clean success criterion.

## Immediate next step

Recommended:
1. Keep Phase 1 live for testnet demos.
2. Implement durable storage and repository adapters for Phase 2.
3. Wire smart-wallet deployment after durable identity is in place.
