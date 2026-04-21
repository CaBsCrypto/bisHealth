extern crate std;

use soroban_sdk::{testutils::Address as _, Address, Env};

use crate::{TrustLeafRbac, TrustLeafRbacClient};

#[test]
fn initializes_admin_role() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TrustLeafRbac, ());
    let client = TrustLeafRbacClient::new(&env, &contract_id);
    let admin = Address::generate(&env);

    client.init(&admin);

    assert!(client.has_role(&soroban_sdk::symbol_short!("ADMIN"), &admin));
}

#[test]
fn admin_grants_role() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TrustLeafRbac, ());
    let client = TrustLeafRbacClient::new(&env, &contract_id);
    let admin = Address::generate(&env);
    let doctor = Address::generate(&env);

    client.init(&admin);
    client.grant_role(&admin, &soroban_sdk::symbol_short!("DOCTOR"), &doctor);

    assert!(client.has_role(&soroban_sdk::symbol_short!("DOCTOR"), &doctor));
}
