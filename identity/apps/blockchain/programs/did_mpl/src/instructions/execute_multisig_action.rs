use borsh::BorshDeserialize;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
};

use crate::{helper, states};

pub(crate) fn execute_multisig_action(accounts: &[AccountInfo]) -> ProgramResult {
    let account_iter = &mut accounts.iter();
    let executor = next_account_info(account_iter)?;
    let multisig_action_account_pda = next_account_info(account_iter)?;
    let multisig_voting_account_pda = next_account_info(account_iter)?;
    let multisig_account_pda = next_account_info(account_iter)?;
    let multisig_vault_account_pda = next_account_info(account_iter)?;
    let in_progress_multisig_account_pda = next_account_info(account_iter)?;

    let mut multisig = states::MultiSig::try_from_slice(&multisig_account_pda.data.borrow())?;

    if let Some(perm) = multisig.signers.get(executor.key) {
        if !perm.contains(&states::Permission::Execute {}) {
            panic!("Unauthorized");
        }
    } else {
        panic!("Unauthorized");
    }

    let multisig_voting =
        states::MultiSigVoting::try_from_slice(&multisig_voting_account_pda.data.borrow())?;
    let mut vote_count = 0;
    for (_, value) in multisig_voting.vote_by_signers.into_iter() {
        if value.unwrap_or(false) {
            vote_count += 1;
        }
    }

    if vote_count < multisig.minimum_number_of_signs {
        panic!("Immature execution");
    }

    let multisig_action =
        states::MultiSigAction::try_from_slice(&multisig_action_account_pda.data.borrow())?;

    match multisig_action.action {
        states::Action::UpdateSigners { signers } => {
            multisig.signers = signers;
            helper::update_pda_account(executor, multisig_account_pda, multisig)?;
        }
        states::Action::UpdateIdentityCardHash { hash } => {
            let mut multising_vault =
                states::MultiSigVault::try_from_slice(&multisig_vault_account_pda.data.borrow())?;
            multising_vault.identity_card_hash = hash;
            helper::update_pda_account(executor, multisig_vault_account_pda, multising_vault)?;
        }
        states::Action::AddAssetHash { hash } => {
            let mut multising_vault =
                states::MultiSigVault::try_from_slice(&multisig_vault_account_pda.data.borrow())?;
            if multising_vault.assets_hash.contains(&hash) {
                msg!("Already exists");
                return Ok(());
            }
            multising_vault.assets_hash.push(hash);
            helper::update_pda_account(executor, multisig_vault_account_pda, multising_vault)?;
        }
        states::Action::RemoveAssetHash { hash } => {
            let mut multising_vault =
                states::MultiSigVault::try_from_slice(&multisig_vault_account_pda.data.borrow())?;
            if !multising_vault.assets_hash.contains(&hash) {
                msg!("Assest does not exist");
                return Ok(());
            }
            multising_vault.assets_hash.retain(|x| *x != hash);
            helper::update_pda_account(executor, multisig_vault_account_pda, multising_vault)?;
        }
        states::Action::UpdateMinimumNumberOfSigns { value } => {
            multisig.minimum_number_of_signs = value;
            helper::update_pda_account(executor, multisig_account_pda, multisig)?;
        }
        states::Action::Delete {} => {
            let lamports = multisig_account_pda.lamports();
            **multisig_account_pda.try_borrow_mut_lamports()? -= lamports;
            **executor.try_borrow_mut_lamports()? += lamports;

            let lamports = multisig_vault_account_pda.lamports();
            **multisig_vault_account_pda.try_borrow_mut_lamports()? -= lamports;
            **executor.try_borrow_mut_lamports()? += lamports;
        }
    }

    let mut in_progress_multisig =
        states::InProcessMultiSig::try_from_slice(&in_progress_multisig_account_pda.data.borrow())?;

    in_progress_multisig
        .actions
        .retain(|x| *x != multisig_action.action_id);

    helper::update_pda_account(
        &executor,
        &in_progress_multisig_account_pda,
        in_progress_multisig,
    )?;

    let lamports = multisig_action_account_pda.lamports();
    **multisig_action_account_pda.try_borrow_mut_lamports()? -= lamports;
    **executor.try_borrow_mut_lamports()? += lamports;

    let lamports = multisig_voting_account_pda.lamports();
    **multisig_voting_account_pda.try_borrow_mut_lamports()? -= lamports;
    **executor.try_borrow_mut_lamports()? += lamports;

    Ok(())
}
