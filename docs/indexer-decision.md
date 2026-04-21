# Trust Leaf Indexer Decision

Date: 2026-04-19

## Decision

For the MVP, Trust Leaf keeps the projection layer vendor-neutral and optimizes first for Stellar-native ingestion.

That means:

- We implement deterministic TypeScript projections locally in `indexer/`.
- We keep the ingestion edge compatible with Mercury-style Soroban event feeds.
- We do not lock the project into a provider-specific processor runtime yet.

## Why

- Trust Leaf needs low-latency indexed reads for batch dashboards, prescription history, and dispensary verification.
- The event model is already compact and replay-friendly, so the highest leverage move is to stabilize the projection logic first.
- This reduces risk while contracts and frontend are still moving quickly.

## Outcome

- `indexer/schema.graphql` mirrors the read models the frontend will need.
- `indexer/src` can replay raw Soroban events into deterministic entities.
- The remaining integration work is mostly transport-specific: how events arrive, how entities persist, and where queries are served from.
