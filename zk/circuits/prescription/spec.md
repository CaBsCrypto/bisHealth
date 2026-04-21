# Private Prescription Circuit Spec

## Goal

Prove that a patient is entitled to redeem a medicinal cannabis prescription without revealing personal medical data on-chain.

## Circuit statement

The prover demonstrates knowledge of private inputs that satisfy all of the following:

1. The on-chain `commitment` was derived from the private witness.
2. The `patient_nullifier` was deterministically derived from patient secret material and the prescription identifier.
3. The prescription remains within its validity window.
4. The requested dosage class is allowed by the committed medical policy.

## Private witness

- `patient_secret`
- `prescription_id`
- `issued_at_unix`
- `valid_until_unix`
- `dosage_class`
- `policy_nonce`

## Public inputs

- `commitment`
- `patient_nullifier`
- `policy_hash`
- `current_day`

## Hashing model

For the MVP scaffold we define a deterministic application-side hashing boundary:

- `policy_hash = H(valid_until_unix, dosage_class, policy_nonce)`
- `commitment = H(patient_secret, prescription_id, issued_at_unix, valid_until_unix, dosage_class, policy_nonce)`
- `patient_nullifier = H(patient_secret, prescription_id, policy_nonce)`
- `public_inputs_hash = H(commitment, patient_nullifier, policy_hash, current_day)`

`H` is represented as a placeholder application hash in the current repo scaffolding. In the production ZK implementation, this should be swapped for a circuit-compatible hash such as Poseidon/Poseidon2 so the same field arithmetic can be reused off-chain and, where needed, on-chain.

## Constraint checks

- recompute `policy_hash`
- recompute `commitment`
- recompute `patient_nullifier`
- assert `current_day <= valid_until_unix`
- assert `dosage_class` is inside the supported class domain

## On-chain contract boundary

The Soroban contract should receive:

- `commitment: BytesN<32>`
- `proof: Bytes`
- `public_inputs_hash: BytesN<32>`

The verifier adapter must decode `proof`, reconstruct the BN254 verifier inputs, and validate a pairing equation with native host functions.

## Proof serialization

Recommended MVP serialization:

- Groth16 BN254 proof
- 256 bytes total
- big-endian concatenation of proof points `A | B | C`

This matches current Stellar ZK ecosystem guidance for Soroban-compatible Groth16 proof byte packing.

## Notes

- Double spend protection lives on-chain through `is_used`.
- Privacy lives off-chain and inside the proof system.
- Indexed UX should only expose redemption status, never witness material.
