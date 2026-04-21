import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPoseidon } from "circomlibjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const buildDir = path.join(rootDir, "build");
const witnessPath = path.resolve(rootDir, "../circuits/prescription/witness.example.json");

const witness = JSON.parse(await readFile(witnessPath, "utf8"));
const poseidon = await buildPoseidon();

function poseidonHash(parts) {
  return poseidon.F.toObject(poseidon(parts.map((value) => BigInt(value))));
}

const patientSecret = BigInt(witness.patient_secret);
const prescriptionId = BigInt(witness.prescription_id);
const issuedAtUnix = BigInt(witness.issued_at_unix);
const validUntilUnix = BigInt(witness.valid_until_unix);
const dosageClass = BigInt(witness.dosage_class);
const policyNonce = BigInt(witness.policy_nonce);
const currentDay = BigInt(witness.current_day);

const policyHash = poseidonHash([validUntilUnix, dosageClass, policyNonce]);
const commitment = poseidonHash([
  patientSecret,
  prescriptionId,
  issuedAtUnix,
  validUntilUnix,
  dosageClass,
  policyNonce
]);
const patientNullifier = poseidonHash([patientSecret, prescriptionId, policyNonce]);

await mkdir(buildDir, { recursive: true });

const input = {
  patientSecret: patientSecret.toString(),
  prescriptionId: prescriptionId.toString(),
  issuedAtUnix: issuedAtUnix.toString(),
  validUntilUnix: validUntilUnix.toString(),
  dosageClass: dosageClass.toString(),
  policyNonce: policyNonce.toString(),
  currentDay: currentDay.toString(),
  commitment: commitment.toString(),
  patientNullifier: patientNullifier.toString(),
  policyHash: policyHash.toString()
};

await writeFile(path.join(buildDir, "input.json"), JSON.stringify(input, null, 2));
