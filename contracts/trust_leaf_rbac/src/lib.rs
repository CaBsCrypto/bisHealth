#![no_std]

use soroban_sdk::{
    contract, contractevent, contractimpl, contracttype, symbol_short, Address, Env, Map, Symbol,
};

const ADMIN: Symbol = symbol_short!("ADMIN");
const DOCTOR: Symbol = symbol_short!("DOCTOR");
const DISP: Symbol = symbol_short!("DISP");
const LAB: Symbol = symbol_short!("LAB");
const CULT: Symbol = symbol_short!("CULT");

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Initialized,
    RoleMember(Symbol, Address),
}

#[contractevent(topics = ["trust_leaf_rbac", "init"])]
#[derive(Clone)]
pub struct InitEvent {
    #[topic]
    pub role: Symbol,
    #[topic]
    pub account: Address,
}

#[contractevent(topics = ["trust_leaf_rbac", "grant"])]
#[derive(Clone)]
pub struct GrantRoleEvent {
    #[topic]
    pub role: Symbol,
    #[topic]
    pub admin: Address,
    #[topic]
    pub account: Address,
}

#[contractevent(topics = ["trust_leaf_rbac", "revoke"])]
#[derive(Clone)]
pub struct RevokeRoleEvent {
    #[topic]
    pub role: Symbol,
    #[topic]
    pub admin: Address,
    #[topic]
    pub account: Address,
}

#[contract]
pub struct TrustLeafRbac;

#[contractimpl]
impl TrustLeafRbac {
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Initialized) {
            panic!("already initialized");
        }

        admin.require_auth();
        env.storage()
            .instance()
            .set(&DataKey::RoleMember(ADMIN, admin.clone()), &true);
        env.storage().instance().set(&DataKey::Initialized, &true);
        InitEvent {
            role: ADMIN,
            account: admin,
        }
        .publish(&env);
    }

    pub fn grant_role(env: Env, admin: Address, role: Symbol, account: Address) {
        Self::require_initialized(&env);
        Self::require_known_role(role.clone());
        Self::require_role_holder(&env, ADMIN, admin.clone());
        env.storage()
            .instance()
            .set(&DataKey::RoleMember(role.clone(), account.clone()), &true);
        GrantRoleEvent {
            role,
            admin,
            account,
        }
        .publish(&env);
    }

    pub fn revoke_role(env: Env, admin: Address, role: Symbol, account: Address) {
        Self::require_initialized(&env);
        Self::require_known_role(role.clone());
        Self::require_role_holder(&env, ADMIN, admin.clone());
        env.storage()
            .instance()
            .remove(&DataKey::RoleMember(role.clone(), account.clone()));
        RevokeRoleEvent {
            role,
            admin,
            account,
        }
        .publish(&env);
    }

    pub fn has_role(env: Env, role: Symbol, account: Address) -> bool {
        env.storage()
            .instance()
            .get(&DataKey::RoleMember(role, account))
            .unwrap_or(false)
    }

    pub fn require_role_holder(env: &Env, role: Symbol, account: Address) {
        Self::require_initialized(env);
        account.require_auth();
        if !Self::has_role(env.clone(), role, account) {
            panic!("missing role");
        }
    }

    pub fn role_constants(env: Env) -> Map<Symbol, Symbol> {
        let mut roles = Map::<Symbol, Symbol>::new(&env);
        roles.set(ADMIN, ADMIN);
        roles.set(DOCTOR, DOCTOR);
        roles.set(DISP, DISP);
        roles.set(LAB, LAB);
        roles.set(CULT, CULT);
        roles
    }

    fn require_initialized(env: &Env) {
        if !env.storage().instance().has(&DataKey::Initialized) {
            panic!("not initialized");
        }
    }

    fn require_known_role(role: Symbol) {
        let is_known =
            role == ADMIN || role == DOCTOR || role == DISP || role == LAB || role == CULT;
        if !is_known {
            panic!("unknown role");
        }
    }
}

#[cfg(test)]
mod test;
