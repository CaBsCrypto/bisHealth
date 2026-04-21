extern crate std;

use soroban_sdk::{testutils::Address as _, Address, BytesN, Env, String};

use crate::{TrustLeafTraceability, TrustLeafTraceabilityClient};

#[test]
fn creates_and_reads_batch() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TrustLeafTraceability, ());
    let client = TrustLeafTraceabilityClient::new(&env, &contract_id);
    let cultivator = Address::generate(&env);
    let lab = Address::generate(&env);
    let batch_id = BytesN::from_array(&env, &[7; 32]);
    let metadata_hash = BytesN::from_array(&env, &[1; 32]);
    let release_hash = BytesN::from_array(&env, &[9; 32]);

    client.create_batch(&cultivator, &batch_id, &metadata_hash);
    client.assign_lab(&cultivator, &batch_id, &lab);
    client.append_event(
        &lab,
        &batch_id,
        &String::from_str(&env, "HARVESTED"),
        &BytesN::from_array(&env, &[2; 32]),
    );
    client.update_status(
        &lab,
        &batch_id,
        &crate::BatchStatus::Released,
        &release_hash,
    );

    let batch = client.get_batch(&batch_id);
    let event_count = client.get_event_count(&batch_id);
    let event = client.get_event(&batch_id, &0);

    assert_eq!(batch.metadata_hash, metadata_hash);
    assert_eq!(batch.latest_document_hash, release_hash);
    assert_eq!(event_count, 1);
    assert_eq!(event.event_type, String::from_str(&env, "HARVESTED"));
}
