#![no_std]

use soroban_sdk::{
    contract, contractevent, contractimpl, contracttype, Address, BytesN, Env, String,
};

#[derive(Clone)]
#[contracttype]
pub enum BatchStatus {
    Created,
    InTesting,
    Released,
    Recalled,
}

#[derive(Clone)]
#[contracttype]
pub struct CannabisBatch {
    pub batch_id: BytesN<32>,
    pub cultivator: Address,
    pub lab: Option<Address>,
    pub metadata_hash: BytesN<32>,
    pub status: BatchStatus,
    pub latest_document_hash: BytesN<32>,
}

#[derive(Clone)]
#[contracttype]
pub struct PlantEvent {
    pub batch_id: BytesN<32>,
    pub event_type: String,
    pub document_hash: BytesN<32>,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Batch(BytesN<32>),
    Event(BytesN<32>, u32),
    EventCount(BytesN<32>),
}

#[contractevent(topics = ["trust_leaf_traceability", "batch_created"])]
#[derive(Clone)]
pub struct BatchCreatedEvent {
    #[topic]
    pub batch_id: BytesN<32>,
    #[topic]
    pub cultivator: Address,
    pub metadata_hash: BytesN<32>,
}

#[contractevent(topics = ["trust_leaf_traceability", "batch_event"])]
#[derive(Clone)]
pub struct BatchEventAddedEvent {
    #[topic]
    pub batch_id: BytesN<32>,
    #[topic]
    pub event_index: u32,
    pub event_type: String,
    pub document_hash: BytesN<32>,
}

#[contractevent(topics = ["trust_leaf_traceability", "lab_assigned"])]
#[derive(Clone)]
pub struct LabAssignedEvent {
    #[topic]
    pub batch_id: BytesN<32>,
    #[topic]
    pub cultivator: Address,
    #[topic]
    pub lab: Address,
}

#[contractevent(topics = ["trust_leaf_traceability", "status_updated"])]
#[derive(Clone)]
pub struct StatusUpdatedEvent {
    #[topic]
    pub batch_id: BytesN<32>,
    #[topic]
    pub actor: Address,
    pub status: BatchStatus,
    pub document_hash: BytesN<32>,
}

#[contract]
pub struct TrustLeafTraceability;

#[contractimpl]
impl TrustLeafTraceability {
    pub fn create_batch(
        env: Env,
        cultivator: Address,
        batch_id: BytesN<32>,
        metadata_hash: BytesN<32>,
    ) {
        cultivator.require_auth();
        if env
            .storage()
            .persistent()
            .has(&DataKey::Batch(batch_id.clone()))
        {
            panic!("batch already exists");
        }

        let batch = CannabisBatch {
            batch_id: batch_id.clone(),
            cultivator: cultivator.clone(),
            lab: None,
            metadata_hash: metadata_hash.clone(),
            status: BatchStatus::Created,
            latest_document_hash: metadata_hash.clone(),
        };

        env.storage()
            .persistent()
            .set(&DataKey::Batch(batch_id.clone()), &batch);
        env.storage()
            .persistent()
            .set(&DataKey::EventCount(batch_id.clone()), &0_u32);
        BatchCreatedEvent {
            batch_id,
            cultivator,
            metadata_hash,
        }
        .publish(&env);
    }

    pub fn append_event(
        env: Env,
        actor: Address,
        batch_id: BytesN<32>,
        event_type: String,
        document_hash: BytesN<32>,
    ) {
        actor.require_auth();
        let mut batch = Self::get_batch(env.clone(), batch_id.clone());
        if actor != batch.cultivator && batch.lab != Some(actor.clone()) {
            panic!("actor not allowed for batch");
        }

        let event = PlantEvent {
            batch_id: batch_id.clone(),
            event_type: event_type.clone(),
            document_hash: document_hash.clone(),
        };

        let next_id: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::EventCount(batch_id.clone()))
            .unwrap_or(0);
        env.storage()
            .persistent()
            .set(&DataKey::Event(batch_id.clone(), next_id), &event);
        env.storage()
            .persistent()
            .set(&DataKey::EventCount(batch_id.clone()), &(next_id + 1));
        batch.latest_document_hash = document_hash.clone();
        env.storage()
            .persistent()
            .set(&DataKey::Batch(batch_id.clone()), &batch);
        BatchEventAddedEvent {
            batch_id,
            event_index: next_id,
            event_type,
            document_hash,
        }
        .publish(&env);
    }

    pub fn assign_lab(env: Env, cultivator: Address, batch_id: BytesN<32>, lab: Address) {
        cultivator.require_auth();
        let mut batch = Self::get_batch(env.clone(), batch_id.clone());
        if batch.cultivator != cultivator {
            panic!("only cultivator may assign lab");
        }

        batch.lab = Some(lab.clone());
        env.storage()
            .persistent()
            .set(&DataKey::Batch(batch_id.clone()), &batch);
        LabAssignedEvent {
            batch_id,
            cultivator,
            lab,
        }
        .publish(&env);
    }

    pub fn update_status(
        env: Env,
        actor: Address,
        batch_id: BytesN<32>,
        status: BatchStatus,
        document_hash: BytesN<32>,
    ) {
        actor.require_auth();
        let mut batch = Self::get_batch(env.clone(), batch_id.clone());
        if actor != batch.cultivator && batch.lab != Some(actor.clone()) {
            panic!("actor not allowed for status");
        }

        batch.status = status.clone();
        batch.latest_document_hash = document_hash.clone();
        env.storage()
            .persistent()
            .set(&DataKey::Batch(batch_id.clone()), &batch);
        StatusUpdatedEvent {
            batch_id,
            actor,
            status,
            document_hash,
        }
        .publish(&env);
    }

    pub fn get_batch(env: Env, batch_id: BytesN<32>) -> CannabisBatch {
        env.storage()
            .persistent()
            .get(&DataKey::Batch(batch_id))
            .unwrap()
    }

    pub fn get_event(env: Env, batch_id: BytesN<32>, event_id: u32) -> PlantEvent {
        env.storage()
            .persistent()
            .get(&DataKey::Event(batch_id, event_id))
            .unwrap()
    }

    pub fn get_event_count(env: Env, batch_id: BytesN<32>) -> u32 {
        env.storage()
            .persistent()
            .get(&DataKey::EventCount(batch_id))
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod test;
