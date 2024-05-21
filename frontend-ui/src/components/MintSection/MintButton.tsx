import React, { useEffect, useState } from "react";
import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { Address, Cell } from "@ton/ton";
import { formatHash, sleep } from "@/helpers";
import { useCollectionContract } from "@/hooks/useCollectionContract";
import { useNft } from "@/contexts/NftContext/hooks";
import axios from "axios";
import FullScreenLoader from "../FullscreenLoading/FullScreenLoader";
import { CHAIN } from "@tonconnect/ui-react";
import { toast } from "react-toastify";

const MintButton: React.FC = () => {
  const rawAddress = useTonAddress(false);
  const userFriendlyAddress = Address.parseRaw(rawAddress).toString();
  const collection = useCollectionContract(false);
  const tonWallet = useTonWallet();
  const chain = tonWallet?.account.chain ?? CHAIN.TESTNET;
  const { onSetTriggerRefresh } = useNft();
  const [loading, setLoading] = useState(false);
  const [mintNumber, setMintNumber] = useState(1);

  const mint = async () => {
    try {
      await collection.mintNft(mintNumber);
    } catch (err: any) {
      console.error("mint nft error", err.message);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (collection.boc && chain) {
          setLoading(true);
          let tries = 1;
          let hash = Cell.fromBase64(collection.boc).hash().toString("base64");
          while (true) {
            if (tries > 100) {
              return;
            }
            await sleep(3000);
            console.log("fetch first batch event", tries);
            const { data, status } = await axios.get("/api/ton", {
              params: {
                chain,
                hash,
              },
            });

            if (status === 200 && data && data.out_msgs.length === 0) {
              onSetTriggerRefresh();
              tries = 1;
              setLoading(false);
              toast.success(`Mint ${mintNumber} NFT Suceess`, {
                autoClose: 3000,
                toastId: "mintSuccess",
              });
              break;
            } else {
              if (data && data.out_msgs.length > 0) {
                hash = data.out_msgs[0].hash;
              }
              tries++;
            }
          }
        }
      } catch (error: any) {
        console.error("fetchEvents error", error.message);
        setLoading(false);
      }
    };
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection.boc, chain]);

  return (
    <>
      <div className="w-full flex flex-col items-center mt-5 mb-20">
        <div className=" flex items-center justify-center gap-5 mb-10">
          <button
            className="w-10 h-10 rounded-full border-none text-white text-4xl flex items-center justify-center bg-[#ff4081] disabled:text-gray-300"
            onClick={() => setMintNumber((x) => (x = x - 1))}
            disabled={mintNumber <= 1}
          >
            -
          </button>
          <div className="text-black text-2xl font-bold mx-3">{mintNumber}</div>
          <button
            className="w-10 h-10 rounded-full border-none text-white text-4xl flex items-center justify-center bg-[#ff4081] disabled:text-gray-300"
            onClick={() => setMintNumber((x) => (x = x + 1))}
            disabled={mintNumber >= 2}
          >
            +
          </button>
        </div>
        <button className="w-[300px] rounded-3xl ring-8 ring-white text-white bg-gradient-to-r from-[#fccadf] to-[#ff4081] relative">
          <div
            className="py-2 bg-contain flex flex-col items-center justify-center gap-1 cursor-pointer"
            onClick={mint}
          >
            <div className="text-2xl font-main">Mint</div>
            <div className="font-mono">({formatHash(userFriendlyAddress)})</div>
          </div>
        </button>
      </div>
      <FullScreenLoader loading={loading} />
    </>
  );
};

export default MintButton;
