import { CHAIN } from "@tonconnect/ui-react";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BASE_URL = {
  [CHAIN.TESTNET]: "https://testnet.toncenter.com/api/v3",
  [CHAIN.MAINNET]: "https://toncenter.com/api/v3",
};

export default async function tonHandler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const { chain, hash } = request.query;
    console.log(">>>>>>>>>hash", hash);
    if (!chain || !hash)
      return response.status(404).send("chain and hash are required");
    const decodedHash = decodeURIComponent(hash as string);
    const encodedHash = encodeURIComponent(decodedHash);
    console.log(">>>>>>>>>>>encodedHash", encodedHash);
    const baseUrl = BASE_URL[chain as CHAIN];
    const url = `${baseUrl}/transactionsByMessage?direction=in&msg_hash=${encodedHash}&limit=128&offset=0`;
    const { data } = await axios.get(url);
    return response.status(200).json(data.transactions[0]);
  } catch (error) {
    return response.status(500).json({ error: "Server Error" });
  }
}
