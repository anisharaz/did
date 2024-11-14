use borsh::BorshSerialize;
use solana_program::{
    account_info::AccountInfo, entrypoint::ProgramResult, program::invoke, program::invoke_signed,
    pubkey::Pubkey, rent::Rent, system_instruction, sysvar::Sysvar,
};
use std::cell::RefCell;

pub(crate) fn create_pda_account<'a, W: BorshSerialize>(
    program_id: &Pubkey,
    signer: &AccountInfo<'a>,
    account_pda: &AccountInfo<'a>,
    bump: u8,
    data: W,
) -> ProgramResult {
    let data_span = (borsh::to_vec(&data)?).len();
    let lamports_required = (Rent::get()?).minimum_balance(data_span);

    invoke_signed(
        &system_instruction::create_account(
            signer.key, // User is payer
            account_pda.key,
            lamports_required,
            data_span as u64,
            program_id,
        ),
        &[signer.clone(), account_pda.clone()],
        &[&[signer.key.as_ref(), &[bump]]],
    )?;

    data.serialize(&mut (&mut RefCell::borrow_mut(&account_pda.data)[..]))?;

    Ok(())
}

pub(crate) fn update_pda_account<'a, W: BorshSerialize>(
    signer: &AccountInfo<'a>,
    account_pda: &AccountInfo<'a>,
    data: W,
) -> ProgramResult {
    let data_span = (borsh::to_vec(&data)?).len();
    let lamports_required = (Rent::get()?).minimum_balance(data_span);

    if lamports_required > account_pda.lamports() {
        invoke(
            &system_instruction::transfer(
                signer.key,
                account_pda.key,
                lamports_required - account_pda.lamports(),
            ),
            &[signer.clone(), account_pda.clone()],
        )?;
    }

    account_pda.realloc((borsh::to_vec(&data)?).len(), false)?;

    data.serialize(&mut (&mut RefCell::borrow_mut(&account_pda.data)[..]))?;
    Ok(())
}
