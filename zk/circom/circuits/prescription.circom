pragma circom 2.1.9;

include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";

template PrescriptionProof() {
    signal input patientSecret;
    signal input prescriptionId;
    signal input issuedAtUnix;
    signal input validUntilUnix;
    signal input dosageClass;
    signal input policyNonce;
    signal input currentDay;

    signal input commitment;
    signal input patientNullifier;
    signal input policyHash;

    component policyHashPoseidon = Poseidon(3);
    policyHashPoseidon.inputs[0] <== validUntilUnix;
    policyHashPoseidon.inputs[1] <== dosageClass;
    policyHashPoseidon.inputs[2] <== policyNonce;
    policyHashPoseidon.out === policyHash;

    component commitmentPoseidon = Poseidon(6);
    commitmentPoseidon.inputs[0] <== patientSecret;
    commitmentPoseidon.inputs[1] <== prescriptionId;
    commitmentPoseidon.inputs[2] <== issuedAtUnix;
    commitmentPoseidon.inputs[3] <== validUntilUnix;
    commitmentPoseidon.inputs[4] <== dosageClass;
    commitmentPoseidon.inputs[5] <== policyNonce;
    commitmentPoseidon.out === commitment;

    component nullifierPoseidon = Poseidon(3);
    nullifierPoseidon.inputs[0] <== patientSecret;
    nullifierPoseidon.inputs[1] <== prescriptionId;
    nullifierPoseidon.inputs[2] <== policyNonce;
    nullifierPoseidon.out === patientNullifier;

    // Supported dosage classes: exactly one of 1, 2, 3.
    component isOne = IsEqual();
    component isTwo = IsEqual();
    component isThree = IsEqual();
    isOne.in[0] <== dosageClass;
    isOne.in[1] <== 1;
    isTwo.in[0] <== dosageClass;
    isTwo.in[1] <== 2;
    isThree.in[0] <== dosageClass;
    isThree.in[1] <== 3;
    isOne.out + isTwo.out + isThree.out === 1;

    // Current day must be less than or equal to the validity bound.
    component validWindow = LessEqThan(64);
    validWindow.in[0] <== currentDay;
    validWindow.in[1] <== validUntilUnix;
    validWindow.out === 1;
}

component main {public [commitment, patientNullifier, policyHash, currentDay]} = PrescriptionProof();
