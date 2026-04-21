import { Prescription, PrescriptionConsumption, ProjectionState } from "../model.js";
import { TrustLeafEvent } from "../types.js";

export function applyZkMedicalEvent(state: ProjectionState, event: TrustLeafEvent): void {
  switch (event.kind) {
    case "prescription_issued": {
      const prescription: Prescription = {
        id: event.commitment,
        doctor: event.doctor,
        patientNullifier: event.patientNullifier,
        policyHash: event.policyHash,
        isUsed: false,
        lastVerifiedBy: null,
        createdAtLedger: event.ledger,
        createdAtTxHash: event.txHash,
        consumedAtLedger: null,
        consumedAtTxHash: null,
      };
      state.prescriptions.set(prescription.id, prescription);
      return;
    }
    case "prescription_consumed": {
      const prescription = state.prescriptions.get(event.commitment);
      if (!prescription) {
        throw new Error(`missing prescription ${event.commitment}`);
      }

      prescription.isUsed = true;
      prescription.lastVerifiedBy = event.caller;
      prescription.consumedAtLedger = event.ledger;
      prescription.consumedAtTxHash = event.txHash;
      state.prescriptions.set(prescription.id, prescription);

      const consumption: PrescriptionConsumption = {
        id: event.id,
        prescriptionId: event.commitment,
        caller: event.caller,
        patientNullifier: event.patientNullifier,
        ledger: event.ledger,
        txHash: event.txHash,
        logIndex: event.logIndex,
      };
      state.prescriptionConsumptions.set(consumption.id, consumption);
      return;
    }
    default:
      return;
  }
}
