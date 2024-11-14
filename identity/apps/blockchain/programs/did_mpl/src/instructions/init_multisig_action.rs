use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    pubkey::Pubkey,
};
use std::collections::HashMap;

use crate::{helper, states};

pub(crate) fn init_multisig_action(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    action_id: String,
    action: states::Action,
    multisig_action_account_bump: u8,
    multisig_voting_account_bump: u8,
    in_progress_multisig_account_bump: u8,
) -> ProgramResult {
    let account_iter = &mut accounts.iter();
    let creator = next_account_info(account_iter)?;
    let multisig_action_account_pda = next_account_info(account_iter)?;
    let multisig_voting_account_pda = next_account_info(account_iter)?;
    let in_progress_multisig_account_pda = next_account_info(account_iter)?;
    let multisig_account_pda = next_account_info(account_iter)?;

    let multisig: states::MultiSig = multisig_account_pda.deserialize_data().unwrap();

    if let Some(perm) = multisig.signers.get(creator.key) {
        if !perm.contains(&states::Permission::Initiate) {
            panic!("Unauthorized");
        }
    }

    // For Action Account
    let multisig_action = states::MultiSigAction {
        bump: multisig_action_account_bump,
        action_id: action_id.clone(),
        action,
    };

    helper::create_pda_account(
        program_id,
        &creator,
        &multisig_action_account_pda,
        multisig_action_account_bump,
        multisig_action,
    )?;

    // For Voting Account
    let mut vote_by_signers: HashMap<Pubkey, Option<bool>> = HashMap::new();

    for account in account_iter {
        vote_by_signers.insert(account.key.to_owned(), None);
    }

    let multisig_voting = states::MultiSigVoting {
        bump: multisig_voting_account_bump,
        action_id: action_id.clone(),
        vote_by_signers,
    };

    helper::create_pda_account(
        program_id,
        &creator,
        &multisig_voting_account_pda,
        multisig_voting_account_bump,
        multisig_voting,
    )?;

    // Update InProgressMultiSig
    if in_progress_multisig_account_pda
        .try_data_is_empty()
        .unwrap_or(true)
    {
        let in_progress_multisig = states::InProcessMultiSig {
            bump: in_progress_multisig_account_bump,
            actions: vec![action_id],
        };

        helper::create_pda_account(
            program_id,
            &creator,
            &in_progress_multisig_account_pda,
            in_progress_multisig_account_bump,
            in_progress_multisig,
        )?;
    } else {
        let mut in_progress_multisig: states::InProcessMultiSig =
            in_progress_multisig_account_pda.deserialize_data().unwrap();
        if in_progress_multisig.actions.contains(&action_id) {
            panic!("In Progress Exists");
        }
        in_progress_multisig.actions.push(action_id);

        helper::update_pda_account(
            &creator,
            &in_progress_multisig_account_pda,
            in_progress_multisig,
        )?;
    }

    Ok(())
}
