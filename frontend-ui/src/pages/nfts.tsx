import { NextPage } from "next";
import Layout from "@/components/Layout/Layout";
import { useState, useEffect } from "react";
import cx from "classnames";
import { useCollectionContract } from "@/hooks/useCollectionContract";
import {
  TonConnectButton,
  useTonAddress,
  useTonWallet,
} from "@tonconnect/ui-react";
import { useNFTItemContract } from "@/hooks/useNFTItemContract";
import { NftItem } from "@/services/graph";
import { Address, Cell } from "@ton/core";
import { CHAIN } from "@tonconnect/ui-react";
import FullScreenLoader from "@/components/FullscreenLoading/FullScreenLoader";
import { useNft } from "@/contexts/NftContext/hooks";
import axios from "axios";
import Image from "next/image";
import { sleep, getModelName } from "@/helpers";
import Link from "next/link";

const NFTs: NextPage = () => {
  const rawAddress = useTonAddress(false);
  const tonWallet = useTonWallet();
  const chain = tonWallet?.account.chain ?? CHAIN.TESTNET;
  const { isOpen } = useCollectionContract(true);
  const [myNFTs, setMyNFTs] = useState<NftItem[] | undefined>();
  const [loading, setLoading] = useState(false);
  const { updateNFT, boc } = useNFTItemContract();
  const { triggerRefresh, onSetTriggerRefresh } = useNft();

  const revealNFT = async (item: NftItem) => {
    try {
      const nftItemAddress = item.address;
      await updateNFT(nftItemAddress);
    } catch (err: any) {
      console.error("revealNFT error", err.message);
    }
  };

  useEffect(() => {
    const getMyNFTs = async () => {
      try {
        if (!rawAddress || !chain) return;
        setLoading(true);
        const userFriendlyAddress = Address.parseRaw(rawAddress).toString();

        const { data } = await axios.get("/api/nft", {
          params: {
            chain,
          },
        });

        const allNfts = data as NftItem[];
        const myNftData = allNfts.filter(
          (item) => item.owner.wallet === userFriendlyAddress
        );
        setMyNFTs(myNftData);
      } catch (err: any) {
        console.error("getMyNFTs error", err.message);
      } finally {
        setLoading(false);
      }
    };
    getMyNFTs();
  }, [rawAddress, chain, triggerRefresh]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (boc && chain) {
          setLoading(true);
          let tries = 1;
          let hash = Cell.fromBase64(boc).hash().toString("base64");
          while (true) {
            if (tries > 20) {
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
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boc, chain]);

  return (
    <>
      <Layout>
        <div className="bg-home bg-center bg-no-repeat bg-cover h-screen w-screen p-10">
          <div className="flex items-center justify-center flex-col h-full  max-h-[1400px]">
            <div className="text-2xl text-[#ff4081] font-bold mt-10 mb-5 uppercase font-main">
              Collections
            </div>
            {!isOpen && (
              <div className="mb-5 text-black font-mono text-lg">
                Reveal Coming Soon!
              </div>
            )}
            {rawAddress ? (
              <div className="mb-20 w-full">
                {myNFTs ? (
                  myNFTs.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {myNFTs.map((nft) => (
                        <div
                          className="col-span-1 flex items-center justify-start flex-col"
                          key={nft.id}
                        >
                          <div className="relative">
                            <Image
                              src={
                                nft.content?.originalUrl ?? "/images/coming.png"
                              }
                              alt="My NFT"
                              className={cx(
                                "rounded-xl border-[1px] border-[#ff4081]",
                                {
                                  ["opacity-70"]:
                                    nft.attributes.length <= 0 ||
                                    !nft.content?.originalUrl,
                                }
                              )}
                              width={150}
                              height={150}
                            />
                            {!isOpen ? (
                              <div />
                            ) : nft.attributes.length <= 0 ? (
                              <button
                                className="bg-[#ff4081] absolute text-white px-6 py-1 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full"
                                onClick={async () => await revealNFT(nft)}
                              >
                                Reveal
                              </button>
                            ) : (
                              <Link
                                className="bg-[#ff4081] absolute text-white px-6 py-1 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full"
                                href={`/chat/${getModelName(nft.attributes)}`}
                              >
                                Chat
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[200px] font-bold text-2xl items-center justify-center flex-col text-[#ff4081]">
                      No NFTs Found
                    </div>
                  )
                ) : (
                  <div />
                )}
              </div>
            ) : (
              <div className="w-ful flex justify-center items-center">
                <TonConnectButton className="text-lg" />
              </div>
            )}
          </div>
        </div>
      </Layout>

      {rawAddress && (
        <FullScreenLoader loading={loading || myNFTs === undefined} />
      )}
    </>
  );
};

export default NFTs;
