# Trust Leaf ZK Engine

This folder hosts the off-chain proof system for private medical prescriptions.

## Planned responsibilities

- circuit for prescription validity
- patient nullifier generation
- public input hashing
- proof packaging for Soroban verifier entrypoints
- deterministic app-side adapter for witness/public signal derivation

## Suggested target flow

1. Doctor backend encrypts medical payload off-chain.
2. A commitment is generated from prescription data and patient secret material.
3. The commitment is anchored on-chain.
4. Patient device generates a proof that:
   - it knows the secret behind the commitment
   - the prescription is valid
   - the nullifier has not been used
5. Dispensary submits proof for verification and consumption.

## Next implementation

- replace scaffold hash with Poseidon/Poseidon2-compatible gadgets
- generate Groth16 BN254 verifier artifacts
- map verifier calldata into Soroban host-function checks

## Current scaffold

- `circuits/prescription/spec.md`: exact statement and signal contract
- `circuits/prescription/witness.example.json`: example witness values
- `noir/`: design sandbox for circuit shape
- `circom/`: canonical MVP proving backend path
- `adapters/typescript/`: deterministic signal derivation and proof envelope packing
