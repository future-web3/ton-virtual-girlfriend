import { useEffect, useState } from "react";
import { NftCollection } from "@/wrappers/NftCollection";
import { useTonConnect } from "./useTonConnect";
import { Address, Cell, OpenedContract, toNano } from "@ton/core";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonWallet } from "@tonconnect/ui-react";
import { useNft } from "@/contexts/NftContext/hooks";
import { CHAIN } from "@tonconnect/ui-react";
import { NFT_ADDRESS, sleep } from "@/helpers";

export function useCollectionContract(fetchData: boolean) {
  const client = useTonClient();
  const tonWallet = useTonWallet();
  const chain = tonWallet?.account.chain ?? CHAIN.TESTNET;
  const { sender, boc } = useTonConnect();
  const { triggerRefresh } = useNft();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const collectionContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = NftCollection.fromAddress(
      Address.parse(NFT_ADDRESS[chain])
    );
    return client.open(contract) as OpenedContract<NftCollection>;
  }, [client]);

  useEffect(() => {
    const fetchCollectionData = async () => {
      if (!collectionContract || !fetchData) return;
      try {
        const collectionData = await collectionContract.getGetCollectionData();
        await sleep(500);
        const isAllowOpen = await collectionContract.getGetAllowOpen();
        const nextIndex = collectionData.next_item_index.toString();
        setCurrentIndex(Number(nextIndex) - 1);
        setIsOpen(isAllowOpen);
      } catch (err: any) {
        console.error("fetchCollectionData error", err.message);
      }
    };
    fetchCollectionData();
  }, [collectionContract, triggerRefresh, fetchData]);

  return {
    address: collectionContract?.address.toString(),
    currentIndex,
    isOpen,
    mintNft: async (number: number) => {
      return await collectionContract?.send(
        sender,
        { value: toNano(0.5 * number) },
        {
          $$type: "BatchMint",
          number: BigInt(number),
        }
      );
    },
    purchaseGptToken: async (tonAmount: string) => {
      return await collectionContract?.send(
        sender,
        { value: toNano(Number(tonAmount)) },
        "GptTokenPurchase"
      );
    },
    boc,
  };
}
