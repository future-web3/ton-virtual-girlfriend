import { NftItem } from "@/wrappers/NftItem";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract, toNano } from "@ton/core";
import { useTonClient } from "./useTonClient";

export function useNFTItemContract() {
  const client = useTonClient();
  const { sender, boc } = useTonConnect();

  const getNFTItemContract = async (nftAddress: string) => {
    if (!client || !nftAddress) return;
    const contract = NftItem.fromAddress(Address.parse(nftAddress));
    return client.open(contract) as OpenedContract<NftItem>;
  };

  return {
    updateNFT: async (nftAddress: string) => {
      if (!nftAddress) return;
      const nftItemContract = await getNFTItemContract(nftAddress);
      return await nftItemContract?.send(
        sender,
        { value: toNano(0.1) },
        "update"
      );
    },
    boc,
  };
}
