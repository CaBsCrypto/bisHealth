import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const buildDir = path.join(rootDir, "build");

function fieldToHex(value) {
  return BigInt(value).toString(16).padStart(64, "0");
}

function g2ToSorobanHex(point) {
  return [
    fieldToHex(point[0][1]),
    fieldToHex(point[0][0]),
    fieldToHex(point[1][1]),
    fieldToHex(point[1][0])
  ].join("");
}

const proof = JSON.parse(await readFile(path.join(buildDir, "proof.json"), "utf8"));
const publicInputs = JSON.parse(await readFile(path.join(buildDir, "public.json"), "utf8"));

const proofHex = [
  fieldToHex(proof.pi_a[0]),
  fieldToHex(proof.pi_a[1]),
  g2ToSorobanHex(proof.pi_b),
  fieldToHex(proof.pi_c[0]),
  fieldToHex(proof.pi_c[1])
].join("");

const proofAHex = [
  fieldToHex(proof.pi_a[0]),
  fieldToHex(proof.pi_a[1])
].join("");

const proofBHex = g2ToSorobanHex(proof.pi_b);

const proofCHex = [
  fieldToHex(proof.pi_c[0]),
  fieldToHex(proof.pi_c[1])
].join("");

const publicInputsHex = publicInputs.map(fieldToHex).join("");
const publicInputsHashHex = createHash("sha256")
  .update(Buffer.from(publicInputsHex, "hex"))
  .digest("hex");

const fixture = {
  proofHex,
  proofParts: {
    aHex: proofAHex,
    bHex: proofBHex,
    cHex: proofCHex
  },
  publicInputs,
  publicInputsHashHex,
  publicInputOrder: ["currentDay", "commitment", "patientNullifier", "policyHash"],
  note: "Proof G2 bytes use Soroban BN254 encoding (c1||c0 for each Fp2 coordinate). Public inputs are serialized as 32-byte big-endian field elements in the exact order emitted by snarkjs public.json for this circuit."
};

await writeFile(path.join(buildDir, "proof-fixture.json"), JSON.stringify(fixture, null, 2));
