import { applyRbacEvent } from "./mappings/rbac.js";
import { applyTraceabilityEvent } from "./mappings/traceability.js";
import { applyZkMedicalEvent } from "./mappings/zkMedical.js";
import { createProjectionState, ProjectionState } from "./model.js";
import {
  normalizeSorobanEvent,
  ProjectionRoute,
  RawSorobanEvent,
  TrustLeafEvent,
} from "./types.js";

export function routeEvent(event: RawSorobanEvent): ProjectionRoute {
  const normalized = normalizeSorobanEvent(event);
  if (!normalized) {
    return "mappings/unknown";
  }

  switch (normalized.kind) {
    case "role_initialized":
    case "role_granted":
    case "role_revoked":
      return "mappings/rbac";
    case "batch_created":
    case "batch_event_added":
    case "lab_assigned":
    case "status_updated":
      return "mappings/traceability";
    case "prescription_issued":
    case "prescription_consumed":
      return "mappings/zkMedical";
  }
}

export function applyRawEvent(
  state: ProjectionState,
  event: RawSorobanEvent,
): ProjectionState {
  const normalized = normalizeSorobanEvent(event);
  if (!normalized) {
    return state;
  }

  applyNormalizedEvent(state, normalized);
  return state;
}

export function applyRawEvents(
  events: RawSorobanEvent[],
  state: ProjectionState = createProjectionState(),
): ProjectionState {
  for (const event of events) {
    applyRawEvent(state, event);
  }
  return state;
}

export function applyNormalizedEvent(state: ProjectionState, event: TrustLeafEvent): void {
  switch (event.kind) {
    case "role_initialized":
    case "role_granted":
    case "role_revoked":
      applyRbacEvent(state, event);
      return;
    case "batch_created":
    case "batch_event_added":
    case "lab_assigned":
    case "status_updated":
      applyTraceabilityEvent(state, event);
      return;
    case "prescription_issued":
    case "prescription_consumed":
      applyZkMedicalEvent(state, event);
      return;
  }
}
