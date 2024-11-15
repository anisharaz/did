import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { getKeypairFromFile } from "@solana-developers/helpers";
import * as borsh from "borsh";
import { requestSchema } from "./schemas.js";
import * as process from "process";

const programId = new PublicKey(process.env.PROG);

const connection = new Connection("http://localhost:8899", "confirmed");

const keyPair = await getKeypairFromFile("~/.config/solana/id.json");

const blockhashInfo = await connection.getLatestBlockhash();

const tx = new Transaction({
  ...blockhashInfo,
});

const [multisig_account_pda, multisig_account_bump] = PublicKey.findProgramAddressSync(
  // Public key of owner of Multisig 
  [keyPair.publicKey.toBuffer(), "multisig_account_pda"],
  programId,
);

const [multisig_vault_account_pda, multisig_vault_account_bump] = PublicKey.findProgramAddressSync(
  // Public key of owner of Multisig 
  [keyPair.publicKey.toBuffer(), "multisig_vault_account_pda"],
  programId,
);


const data = {
  CreateMultiSig: {
    permissions: [
      [{ Initiate: {} }, { Vote: {} }, { Execute: {} },],
    ],
    minimum_number_of_signs_for_update: 1,
    identity_card_hash: "123456789",
    multisig_account_bump,
    multisig_vault_account_bump
  }
};

const encoded = borsh.serialize(requestSchema, data);


console.log("Data:", encoded);
console.log("Keys:", keyPair.publicKey.toBase58());

try {


  tx.add(
    new TransactionInstruction({
      programId: programId,
      keys: [
        {
          pubkey: keyPair.publicKey,
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
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: Buffer.from(encoded),
    }),
  );

  tx.sign(keyPair);


  const txHash = await connection.sendRawTransaction(tx.serialize());

  console.log("Transaction sent with hash:", txHash);

  await connection.confirmTransaction({
    blockhash: blockhashInfo.blockhash,
    lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
    signature: txHash,
  });

  console.log(`https://explorer.solana.com/tx/${txHash}?cluster=custom`);

} catch (e) {
  console.log(await e.getLogs())
}

