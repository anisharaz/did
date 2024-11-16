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
const keyPair2 = await getKeypairFromFile("testacc.json");

const blockhashInfo = await connection.getLatestBlockhash();

const tx = new Transaction({
  ...blockhashInfo,
});

const [multisig_account_pda, multisig_account_bump] = PublicKey.findProgramAddressSync(
  // Public key of owner of Multisig 
  [keyPair.publicKey.toBuffer(), "multisig_account_pda"],
  programId,
);


const [multisig_voting_account_pda, multisig_voting_account_bump] = PublicKey.findProgramAddressSync(
  // Public key of Proposer 
  [keyPair2.publicKey.toBuffer(), "multisig_voting_account_pda", "action_id<prefered uuid>"],
  programId,
);


const data = {
  VoteMultiSigAction: {
    vote: true
  },
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
          pubkey: multisig_voting_account_pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: multisig_account_pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: keyPair2.publicKey,
          isSigner: false,
          isWritable: false,
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

