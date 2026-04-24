# Trust Leaf MVP Roadmap

## Immediate build order

1. Finalize Soroban contract interfaces and storage model.
2. Implement event design that the indexer will consume.
3. Wire a thin backend for sponsored transaction submission.
4. Build frontend role flows around indexed data and optimistic mutations.
5. Add payment abstraction and end-to-end checkout.

## Contract design principles

- keep storage compact
- prefer hashes over payloads
- emit indexer-friendly events
- separate role control from business modules
- make double-consume impossible by default

## Open decisions

- exact smart account framework choice for passkey-backed signing
- proof system choice between Noir and Circom for fastest hackathon execution
- Supabase/PostgreSQL first deployment target
- Defindex integration depth for the MVP demo
