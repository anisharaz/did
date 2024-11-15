"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { Create_UserDetailUpdate_MultiSigAction } from "../actions/lib/blockchain";
import {
  CreateMultiSigAction,
  UpdateActionCreation_tx,
  UpdateUserData,
} from "../actions/database";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { PublicKey } from "@solana/web3.js";
import WalletConnectPipe from "../pipes/WalletConnectionPipe";

function Government() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [mobile, setMobile] = useState("");
  const [pubKey, setPubKey] = useState("");
  return (
    <WalletConnectPipe title="Connect Wallet to continue">
      <div className="h-screen m-4 border-slate-600 bg-neutral-200 border-2 p-4 rounded-md">
        <form
          onSubmit={async (e) => {
            let tempUUID = uuid();
            tempUUID = tempUUID.split("-")[0]!;
            e.preventDefault();
            await UpdateUserData({
              public_key: pubKey,
              phone: mobile,
            });
            const res = await CreateMultiSigAction({
              id: tempUUID,
              creator_pub_key: publicKey?.toString() as string,
            });
            const { data } = await axios.post(
              "/api/userhashbypubkey",
              {
                public_key: pubKey,
              },
              {
                method: "POST",
              }
            );
            if (res.success) {
              const tx = await Create_UserDetailUpdate_MultiSigAction({
                Connection: connection,
                tempUUID: tempUUID,
                proposer_public_key: publicKey as PublicKey,
                accound_holder_public_key: new PublicKey(pubKey),
                data_hash: data.data_hash,
              });
              const tx_res = await sendTransaction(tx, connection);
              console.log(tx_res);
              await UpdateActionCreation_tx({
                action_id: tempUUID,
                creation_tx: tx_res,
              });
              alert("Proposal Created");
            }
          }}
        >
          <div>
            <div className="text-xl mb-2">Pub key</div>
            <Input
              type="text"
              onChange={(e) => {
                setPubKey(e.target.value);
              }}
            />
          </div>
          <div>
            <div className="text-xl mb-2">New Mobile no.</div>
            <Input
              type="text"
              onChange={(e) => {
                setMobile(e.target.value);
              }}
            />
          </div>
          <Button type="submit" className="mt-4 w-full">
            Submit
          </Button>
        </form>
      </div>
    </WalletConnectPipe>
  );
}

export default Government;
