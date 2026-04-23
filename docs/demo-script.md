# Trust Leaf Demo Script

This runbook is the fastest way to present Trust Leaf as a product, not just as a technical prototype.

## Goal

Present the MVP in a way that feels:

- patient-first
- operationally credible
- technically grounded
- easy to follow for grants, investors, judges, or ecosystem partners

## Recommended duration

- `6-8 minutes`

## Main rule

Start with the patient problem.

Do **not** start with:

- blockchain
- Soroban
- ZK
- passkeys
- fee bumping

Those should appear later as enablers, not as the story itself.

## Routes to open before presenting

- `/`
- `/patient`
- `/doctor`
- `/dispensary`
- `/superadmin`
- `/command-center`
- `/walletless`

## Demo order

1. Landing
Show the product vision:
- patient-first healthcare experience
- curated professional network
- trusted medicinal product flow

Suggested line:
"Trust Leaf turns a fragmented medicinal cannabis process into one trusted patient journey."

2. Patient POV
Use this as the emotional and product center of the demo.

Show:
- verified doctors
- active prescription
- trusted dispensary inventory
- patient live journey rail

Suggested line:
"This is how the product should feel in production: simple, private, and frictionless for the patient."

3. Doctor POV
Move into the clinical operator perspective.

Show:
- consultations
- active patients
- prescription issuance rail

Suggested line:
"The doctor operates inside a curated network and can issue a private prescription without turning the workflow into a crypto process."

4. Dispensary POV
Close the commercial and compliance loop.

Show:
- inventory
- validation queue
- consume rail

Suggested line:
"The dispensary validates eligibility, provenance, and consumes the prescription to prevent double use."

5. Superadmin POV
Explain governance and trust.

Show:
- approval queue
- active access registry
- RBAC bridge

Suggested line:
"Patients can self-serve, but doctors and dispensaries only enter through manual approval and verifiable permissions."

6. Command Center
Prove it is not just a mockup.

Show:
- live contracts
- indexed state
- four operational rails

Suggested line:
"This is where we show the infrastructure is real: contracts are deployed, events are indexed, and each actor rail is connected to testnet-ready operations."

7. Wallet-less / Passkeys
Use this only at the end.

Show:
- passkey flow
- sponsor config
- protected session

Suggested line:
"We hide blockchain friction from the patient. Login starts with passkeys, and the backend sponsors the operational flow."

## Recommended mode during the demo

Default recommendation:

- use `demo/mockup` first
- activate `live rails` second

Why:

- the demo path is smoother for storytelling
- the live rails prove infrastructure without forcing the whole presentation to depend on secrets or session setup

## If you want to show real rails

Before testing from the UI:

- sign in on `/walletless`
- ensure protected endpoints have session access
- optionally load these Vercel secrets:
  - `TRUST_LEAF_DOCTOR_SECRET_KEY`
  - `TRUST_LEAF_DISPENSARY_SECRET_KEY`

## Closing lines

Use one or two of these:

- "Trust Leaf protects medical privacy while keeping product quality auditable."
- "The MVP already proves contracts, indexing, passkeys, sponsorship, and actor-first orchestration on Stellar testnet."
- "This is not just a blockchain demo. It is the beginning of a usable trust standard for medicinal cannabis."
