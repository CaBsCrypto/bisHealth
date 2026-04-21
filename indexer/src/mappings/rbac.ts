import { ProjectionState, RoleChange, RoleMembership } from "../model.js";
import { TrustLeafEvent } from "../types.js";

export function applyRbacEvent(state: ProjectionState, event: TrustLeafEvent): void {
  if (
    event.kind !== "role_initialized" &&
    event.kind !== "role_granted" &&
    event.kind !== "role_revoked"
  ) {
    return;
  }

  const membershipId = `${event.role}:${event.account}`;
  const existing = state.roleMemberships.get(membershipId);
  const membership: RoleMembership = existing ?? {
    id: membershipId,
    role: event.role,
    account: event.account,
    grantedBy: null,
    grantedAtLedger: event.ledger,
    revokedBy: null,
    revokedAtLedger: null,
    isActive: true,
  };

  let action: RoleChange["action"];
  let admin: string | null = null;

  switch (event.kind) {
    case "role_initialized":
      action = "init";
      membership.grantedBy = null;
      membership.grantedAtLedger = event.ledger;
      membership.revokedBy = null;
      membership.revokedAtLedger = null;
      membership.isActive = true;
      break;
    case "role_granted":
      action = "grant";
      admin = event.admin;
      membership.grantedBy = event.admin;
      membership.grantedAtLedger = event.ledger;
      membership.revokedBy = null;
      membership.revokedAtLedger = null;
      membership.isActive = true;
      break;
    case "role_revoked":
      action = "revoke";
      admin = event.admin;
      membership.revokedBy = event.admin;
      membership.revokedAtLedger = event.ledger;
      membership.isActive = false;
      break;
  }

  state.roleMemberships.set(membershipId, membership);
  state.roleChanges.set(event.id, {
    id: event.id,
    role: event.role,
    account: event.account,
    action,
    admin,
    ledger: event.ledger,
    txHash: event.txHash,
    logIndex: event.logIndex,
  });
}
