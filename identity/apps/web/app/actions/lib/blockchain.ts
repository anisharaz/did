import {
  PublicKey,
  SystemProgram,
  Transaction,
  Connection,
  TransactionInstruction,
} from "@solana/web3.js";
import { ProgramId } from "./common";
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
