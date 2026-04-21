fn h(a: Field, b: Field, c: Field, d: Field, e: Field, f: Field) -> pub Field {
    // Placeholder hash composition for scaffold purposes only.
    // Replace with Poseidon/Poseidon2 gadget in production.
    a + b + c + d + e + f
}

fn h3(a: Field, b: Field, c: Field) -> pub Field {
    a + b + c
}

fn dosage_is_supported(dosage_class: Field) {
    assert(dosage_class == 1 || dosage_class == 2 || dosage_class == 3);
}

fn main(
    patient_secret: Field,
    prescription_id: Field,
    issued_at_unix: pub Field,
    valid_until_unix: Field,
    dosage_class: Field,
    policy_nonce: Field,
    commitment: pub Field,
    patient_nullifier: pub Field,
    policy_hash: pub Field,
    current_day: pub Field,
) {
    dosage_is_supported(dosage_class);
    assert(current_day <= valid_until_unix);

    let computed_policy_hash = h3(valid_until_unix, dosage_class, policy_nonce);
    let computed_commitment = h(
        patient_secret,
        prescription_id,
        issued_at_unix,
        valid_until_unix,
        dosage_class,
        policy_nonce,
    );
    let computed_nullifier = h3(patient_secret, prescription_id, policy_nonce);

    assert(policy_hash == computed_policy_hash);
    assert(commitment == computed_commitment);
    assert(patient_nullifier == computed_nullifier);
}

