# ZK Backend Decision

## Decision

Trust Leaf will use **Circom + snarkjs + Groth16 on BN254** as the primary MVP proving stack.

## Why this is the right MVP choice

### 1. Stellar's on-chain direction matches BN254 verification

Stellar Protocol 25 added BN254-related cost types and host support for the verification path we want to target. That makes pairing-based Groth16 the most direct fit for Soroban verification.

### 2. Circom documents a first-class Groth16 flow today

Circom's official proving docs explicitly walk through:

- powers of tau
- phase 2 setup
- `snarkjs groth16 setup`
- `snarkjs groth16 prove`
- `snarkjs groth16 verify`

That is exactly the proof family we need for a BN254 pairing-check verifier path.

### 3. Noir's default backend is not the shortest path here

Noir is excellent for ergonomics, but its official app tutorial currently centers on Barretenberg's UltraHonk backend. That is not the same thing as a plain Groth16 proof flow and would add translation/tooling complexity for this MVP.

## What this means for the repo

- `zk/noir/` remains a useful design sandbox.
- `zk/circom/` becomes the canonical proving implementation path.
- `trust_leaf_zk_medical` should keep its proof API aligned to Groth16 proof bytes.

## Immediate next tasks

1. Port the placeholder circuit into Circom.
2. Add a deterministic witness generator script.
3. Generate a local Groth16 fixture proof and public signals.
4. Update the Soroban verifier boundary to decode the real proof layout.

## References

- Circom proving docs
- Noir web app tutorial using Barretenberg UltraHonk
- Stellar Core v25 release notes describing BN254 cost support

