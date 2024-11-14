use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
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

    let multisig: states::MultiSig = multisig_account_pda.deserialize_data().unwrap();

    if let Some(perm) = multisig.signers.get(executor.key) {
        if !perm.contains(&states::Permission::Execute) {
            panic!("Unauthorized");
        }
    }

    let multisig_voting: states::MultiSigVoting = multisig_account_pda.deserialize_data().unwrap();
    let mut vote_count = 0;
    for (_, value) in multisig_voting.vote_by_signers.into_iter() {
        if value.unwrap_or(false) {
            vote_count += 1;
        }
    }

    if vote_count < multisig.minimum_number_of_signs {
        panic!("Immature execution");
    }

    let multisig_action: states::MultiSigAction =
        multisig_action_account_pda.deserialize_data().unwrap();

    match multisig_action.action {
        states::Action::UpdateSigners(data) => {
            let mut multising: states::MultiSig = multisig_account_pda.deserialize_data().unwrap();
            multising.signers = data;
            helper::update_pda_account(executor, multisig_account_pda, multising)?;
        }
        states::Action::UpdateIdentityCardHash(data) => {
            let mut multising_vault: states::MultiSigVault =
                multisig_vault_account_pda.deserialize_data().unwrap();
            multising_vault.identity_card_hash = data;
            helper::update_pda_account(executor, multisig_vault_account_pda, multising_vault)?;
        }
        states::Action::UpdateMinimumNumberOfSigns(data) => {
            let mut multising: states::MultiSig = multisig_account_pda.deserialize_data().unwrap();
            multising.minimum_number_of_signs = data;
            helper::update_pda_account(executor, multisig_account_pda, multising)?;
        }
        states::Action::Delete => {
            let lamports = multisig_account_pda.lamports();
            **multisig_account_pda.try_borrow_mut_lamports()? -= lamports;
            **executor.try_borrow_mut_lamports()? += lamports;

            let lamports = multisig_vault_account_pda.lamports();
            **multisig_vault_account_pda.try_borrow_mut_lamports()? -= lamports;
            **executor.try_borrow_mut_lamports()? += lamports;
        }
    }

    let mut in_progress_multisig: states::InProcessMultiSig =
        in_progress_multisig_account_pda.deserialize_data().unwrap();
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
