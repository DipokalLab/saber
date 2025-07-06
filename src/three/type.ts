import * as RAPIER from "@dimforge/rapier3d-compat";

export interface UserDataCollider extends RAPIER.Collider {
  userData?: {
    object: unknown;
  };
}
