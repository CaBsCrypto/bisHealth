# Trust Leaf ZK Roadmap

## Current implementation state

The repository now contains a ZK scaffold, not a production verifier.

What is real already:

- on-chain prescription commitment storage
- nullifier uniqueness and single-use consumption state
- deterministic app-side public signal derivation scaffold
- initial Noir circuit shape

What is still placeholder:

- cryptographic hash inside the circuit
- proof generation pipeline
- Groth16 verifier key management
- Soroban BN254 pairing verification logic

## Recommended path

1. Port the scaffold into `zk/circom/circuits/prescription.circom`.
2. Replace placeholder hash arithmetic with Poseidon/Poseidon2.
3. Generate proving and verification keys for Groth16 on BN254.
4. Define canonical proof serialization for `(A, B, C, public_inputs)`.
5. Update `trust_leaf_zk_medical::verify_and_consume` to:
   - decode proof bytes
   - reconstruct public inputs
   - validate `public_inputs_hash`
   - call BN254 host functions for final verification
6. Add integration tests with a fixed witness and proof fixture.

## Contract boundary to preserve

The frontend/backend should continue to treat these as canonical values:

- `commitment`
- `patient_nullifier`
- `policy_hash`
- `public_inputs_hash`

That lets us swap the proving backend later without rewriting the application model.
