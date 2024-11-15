use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};
use std::collections::HashMap;

use crate::{helper, states};

pub(crate) fn create_card_account(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    permissions: Vec<Vec<states::Permission>>,
    minimum_number_of_signs: u32,
    identity_card_hash: String,
    multisig_account_bump: u8,
    multisig_vault_account_bump: u8,
) -> ProgramResult {
    let account_iter = &mut accounts.iter();
    let creator = next_account_info(account_iter)?;
    let multisig_account_pda = next_account_info(account_iter)?;
    let multisig_vault_account_pda = next_account_info(account_iter)?;

    // For MultiSig Account
    let mut signers: HashMap<Pubkey, Vec<states::Permission>> = HashMap::new();
    signers.insert(
        creator.key.to_owned(),
        vec![
            states::Permission::Initiate {},
            states::Permission::Vote {},
            states::Permission::Execute {},
        ],
    );

    for (account, permission) in account_iter.zip(permissions.iter()) {
        msg!("recorded: {:?} {:?}", account, permission);
        signers.insert(account.key.to_owned(), permission.to_owned());
    }

    let multisig = states::MultiSig {
        bump: multisig_account_bump,
        creator: creator.key.to_owned(),
        signers,
        minimum_number_of_signs,
    };

    helper::create_pda_account(
        program_id,
        &creator,
        &multisig_account_pda,
        multisig_account_bump,
        b"multisig_account_pda",
        None,
        multisig,
    )?;

    // For Multisig Vault Account
    let multisig_vault = states::MultiSigVault {
        bump: multisig_vault_account_bump,
        creator: creator.key.to_owned(),
        identity_card_hash,
        assets_hash: Vec::new(),
    };

    helper::create_pda_account(
        program_id,
        &creator,
        &multisig_vault_account_pda,
        multisig_vault_account_bump,
        b"multisig_vault_account_pda",
        None,
        multisig_vault,
    )?;
    Ok(())
}
