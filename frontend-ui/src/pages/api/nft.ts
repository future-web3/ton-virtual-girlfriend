import { CHAIN } from "@tonconnect/ui-react";
import { NextApiRequest, NextApiResponse } from "next";
import { getAllNftCollectionItems } from "@/services/graph";

export default async function nftHandler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const { chain } = request.query;
    if (!chain) return response.status(404).send("chain is required");
    const receivedChain = String(chain) as CHAIN;
    if (![CHAIN.MAINNET, CHAIN.TESTNET].includes(receivedChain))
      return response.status(404).send("chain is supported");

    const items = await getAllNftCollectionItems(receivedChain);
    return response.status(200).json(items);
  } catch (error) {
    return response.status(500).json({ error: "Server Error" });
  }
}
