# Trust Leaf Circom Backend

This directory is the canonical MVP proving backend for Trust Leaf.

## Chosen stack

- Circom
- snarkjs
- Groth16
- BN254

## Planned workflow

1. Compile `prescription.circom` into `r1cs` and `wasm`.
2. Generate witness from deterministic JSON input.
3. Run Groth16 setup and derive proving / verification artifacts.
4. Emit:
   - `proof.json`
   - `public.json`
   - packed proof bytes for Soroban

## Output contract

The packed proof envelope must align with:

- `proof`: 256-byte Groth16 BN254 proof
- `public_inputs_hash`: 32-byte hash already expected by `trust_leaf_zk_medical`

