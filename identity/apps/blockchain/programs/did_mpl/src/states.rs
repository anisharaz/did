use std::collections::HashMap;

use crate::states;
use borsh::{BorshDeserialize, BorshSerialize};
use serde::Deserialize;
use solana_program::pubkey::Pubkey;

#[derive(BorshDeserialize, BorshSerialize, Deserialize, PartialEq, Debug, Clone)]
pub(crate) enum Permission {
    Initiate {},
    Vote {},
    Execute {},
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Debug)]
pub(crate) struct MultiSig {
    pub(crate) bump: u8,
    pub(crate) creator: Pubkey,
    pub(crate) signers: HashMap<Pubkey, Vec<Permission>>,
    pub(crate) minimum_number_of_signs: u32,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Debug)]
pub(crate) struct MultiSigVault {
    pub(crate) bump: u8,
    pub(crate) creator: Pubkey,
    pub(crate) identity_card_hash: String,
    pub(crate) assets_hash: Vec<String>,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Debug)]
pub(crate) enum Action {
    // MultiSig
    UpdateSigners {
        signers: HashMap<Pubkey, Vec<states::Permission>>,
    },
    UpdateMinimumNumberOfSigns {
        value: u32,
    },

    // Vault
    UpdateIdentityCardHash {
        hash: String,
    },
    AddAssetHash {
        hash: String,
    },
    RemoveAssetHash {
        hash: String,
    },

    // Common
    Delete {},
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Debug)]
pub(crate) struct MultiSigAction {
    pub(crate) bump: u8,
    pub(crate) action_id: String, // Use in PDA
    pub(crate) action: Action,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Debug)]
pub(crate) struct MultiSigVoting {
    pub(crate) bump: u8,
    pub(crate) action_id: String, // Use in PDA
    pub(crate) vote_by_signers: HashMap<Pubkey, Option<bool>>,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Debug)]
pub(crate) struct InProcessMultiSig {
    pub(crate) bump: u8,
    pub(crate) actions: Vec<String>, // Prefer uuid
}
