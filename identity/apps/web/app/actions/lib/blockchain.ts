import {
  PublicKey,
  SystemProgram,
  Transaction,
  Connection,
  TransactionInstruction,
} from "@solana/web3.js";
import { GetUserBasicDetail, ProgramId } from "./common";
import { requestSchema } from "./OnChainDataSchema";
import * as borsh from "borsh";
import { GovernBody, Nominee, JudicialBody } from "./Wallets";

export async function CreateUserOnChainData({
  public_key,
  identity_hash,
  Connection,
}: {
  public_key: PublicKey;
  identity_hash: string;
  Connection: Connection;
}): Promise<Transaction> {
  const LatestBlock = await Connection.getLatestBlockhash();
  const tx = new Transaction({
    ...LatestBlock,
  });

  const [multisig_account_pda, multisig_account_bump] =
    PublicKey.findProgramAddressSync(
      // Public key from useWallet()
      [public_key.toBuffer(), Buffer.from("multisig_account_pda", "utf-8")],
      ProgramId
    );

  const [multisig_vault_account_pda, multisig_vault_account_bump] =
    PublicKey.findProgramAddressSync(
      [
        public_key.toBuffer(),
        Buffer.from("multisig_vault_account_pda", "utf-8"),
      ],
      ProgramId
    );

  const data = {
    CreateMultiSig: {
      // permission is serial
      permissions: [
        // TODO: add user specific permissions
        [{ Initiate: {} }, { Vote: {} }, { Execute: {} }],
        [{ Initiate: {} }, { Vote: {} }, { Execute: {} }],
        [{ Initiate: {} }, { Vote: {} }, { Execute: {} }],
      ],
      // TODO: update signers to 2
      minimum_number_of_signs_for_update: 1,
      identity_card_hash: identity_hash,
      multisig_account_bump,
      multisig_vault_account_bump,
    },
  };
  // @ts-ignore
  const EncodedData = borsh.serialize(requestSchema, data);

  tx.add(
    new TransactionInstruction({
      programId: ProgramId,
      keys: [
        {
          pubkey: public_key,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: multisig_account_pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: multisig_vault_account_pda,
          isSigner: false,
          isWritable: true,
        },
        //#################### Owners in multisig ############################
        {
          pubkey: new PublicKey(JudicialBody.public_key),
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: new PublicKey(GovernBody.public_key),
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: new PublicKey(Nominee.public_key),
          isSigner: false,
          isWritable: false,
        },
        //#####################################################################
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: Buffer.from(EncodedData),
    })
  );
  return tx;
}

export async function Create_UserDetailUpdate_MultiSigAction({
  proposer_public_key,
  accound_holder_public_key,
  tempUUID,
  Connection,
  data_hash,
}: {
  proposer_public_key: PublicKey;
  accound_holder_public_key: PublicKey;
  tempUUID: string;
  Connection: Connection;
  data_hash: string;
}): Promise<Transaction> {
  const LatestBlock = await Connection.getLatestBlockhash();
  const tx = new Transaction({
    ...LatestBlock,
  });
  const [multisig_account_pda, multisig_account_bump] =
    PublicKey.findProgramAddressSync(
      // Public key of owner of Multisig
      [
        accound_holder_public_key.toBuffer(),
        Buffer.from("multisig_account_pda", "utf-8"),
      ],
      ProgramId
    );

  const [multisig_action_account_pda, multisig_action_account_bump] =
    PublicKey.findProgramAddressSync(
      // Public key of Proposer
      [
        proposer_public_key.toBuffer(),
        Buffer.from("multisig_action_account_pda", "utf-8"),
        Buffer.from(tempUUID, "utf-8"),
      ],
      ProgramId
    );

  const [multisig_voting_account_pda, multisig_voting_account_bump] =
    PublicKey.findProgramAddressSync(
      // Public key of Proposer
      [
        proposer_public_key.toBuffer(),
        Buffer.from("multisig_voting_account_pda"),
        Buffer.from(tempUUID, "utf-8"),
      ],
      ProgramId
    );
  const [in_progress_multisig_account_pda, in_progress_multisig_account_bump] =
    PublicKey.findProgramAddressSync(
      // Public key of owner of Multisig
      [
        proposer_public_key.toBuffer(),
        Buffer.from("in_progress_multisig_account_pda", "utf-8"),
      ],
      ProgramId
    );
  const data = {
    InitMultiSigAction: {
      action_id: tempUUID,
      action: { UpdateIdentityCardHash: { hash: data_hash } },
      multisig_action_account_bump: multisig_action_account_bump,
      multisig_voting_account_bump: multisig_voting_account_bump,
      in_progress_multisig_account_bump: in_progress_multisig_account_bump,
    },
  };
  //@ts-ignore
  const encoded = borsh.serialize(requestSchema, data);

  tx.add(
    new TransactionInstruction({
      programId: ProgramId,
      keys: [
        {
          pubkey: proposer_public_key,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: multisig_action_account_pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: multisig_voting_account_pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: in_progress_multisig_account_pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: multisig_account_pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: Buffer.from(encoded),
    })
  );
  return tx;
}
