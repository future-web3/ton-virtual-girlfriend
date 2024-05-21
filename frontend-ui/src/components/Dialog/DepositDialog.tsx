import { Dispatch, SetStateAction, useState } from "react";
import React, { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useTonWallet, CHAIN, useTonAddress } from "@tonconnect/ui-react";
import { IoArrowDownCircleOutline } from "react-icons/io5";
import { Address } from "@ton/core";
import { calculateGptTokenAmount, numberFormat } from "@/helpers";
import { useCollectionContract } from "@/hooks/useCollectionContract";
import { Cell, fromNano } from "@ton/core";
import { loadEventGptTokenPurchase } from "@/wrappers/NftCollection";
import { useNft } from "@/contexts/NftContext/hooks";
import { sleep } from "@/helpers";
import axios from "axios";
import FullScreenLoader from "../FullscreenLoading/FullScreenLoader";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const apiUrl = process.env.NEXT_PUBLIC_VIRTUAL_MODEL_URL ?? "";

const DepositDialog: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const [tonAmount, setTonAmount] = useState("0");
  const { purchaseGptToken, boc } = useCollectionContract(false);
  const tonWallet = useTonWallet();
  const chain = tonWallet?.account.chain ?? CHAIN.TESTNET;
  const { onSetTriggerTokenRefresh } = useNft();
  const [loading, setLoading] = useState(false);
  const rawAddress = useTonAddress(false);

  const closeModal = () => {
    setIsOpen(false);
    setTonAmount("0");
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const jwtToken = localStorage.getItem("jwt");
        if (boc && chain && jwtToken) {
          setLoading(true);
          let tries = 1;
          const userFriendlyAddress = Address.parseRaw(rawAddress).toString();

          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          };

          await axios.post(
            `${apiUrl}/api/telegram/order/add`,
            {
              boc,
              fromAddress: userFriendlyAddress,
              sendAmount: tonAmount,
            },
            {
              headers,
            }
          );
          const hash = Cell.fromBase64(boc).hash().toString("base64");
          let tempHash = "";
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

            if (status === 200 && data) {
              tempHash = data.out_msgs[0].hash;
              tries = 1;
              break;
            } else {
              tries++;
            }
          }

          while (true) {
            if (tries > 100) {
              return;
            }
            await sleep(3000);
            console.log("fetch second batch event", tries);
            const { data, status } = await axios.get("/api/ton", {
              params: {
                chain,
                hash: tempHash,
              },
            });
            if (status === 200 && data) {
              const body = data.out_msgs[0].message_content.body;
              const event = loadEventGptTokenPurchase(
                Cell.fromBase64(body).asSlice()
              );
              const payment = event.payment.toString();

              await axios.post(
                `${apiUrl}/api/telegram/subscribe`,
                {
                  ton: fromNano(payment),
                },
                { headers }
              );

              await axios.post(
                `${apiUrl}/api/telegram/order/update`,
                {
                  boc,
                  status: "successful",
                },
                {
                  headers,
                }
              );
              setLoading(false);
              toast.success(
                `Purchase ${numberFormat(calculateGptTokenAmount(fromNano(payment)))} GPT Token Success`,
                {
                  autoClose: 5000,
                  toastId: "puchaseTokenSuccess",
                }
              );
              onSetTriggerTokenRefresh();
              break;
            } else {
              tries++;
            }
          }
        }
      } catch (error: any) {
        console.error("fetchEvents error", error.message);
        setLoading(false);
        toast.error(`Purchase GPT Token Error`, {
          autoClose: 3000,
          toastId: "puchaseTokenError",
        });
      } finally {
        closeModal();
      }
    };
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boc, chain]);

  const depositToken = async () => {
    try {
      const jwtToken = localStorage.getItem("jwt");
      if (!jwtToken) {
        alert("Pleasa login first");
        return;
      }
      await purchaseGptToken(tonAmount);
    } catch (err: any) {
      console.error("depositToken error", err.message);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-gradient-to-r to-[#fccadf] from-[#ff4081] rounded-2xl p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-main font-medium leading-6 text-white mb-4 flex items-center justify-between"
                  >
                    <div>Purchase Token</div>
                    <FaTimes className="cursor-ponter" onClick={closeModal} />
                  </Dialog.Title>
                  <div className="my-5 min-h-[80px] overflow-y-auto overflow-hidden max-h-[300px] text-xl font-mono">
                    <div>
                      <div className="text-white mb-1 text-md">Ton Amount:</div>
                      <div className="rounded-2xl border-[1px] flex items-center justify-between pr-2">
                        <input
                          className="w-ful text-white py-1 pl-3 outline-none bg-transparent border-none"
                          value={tonAmount}
                          onChange={(e) => setTonAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-center mt-3 mb-1">
                      <IoArrowDownCircleOutline size={35} color="#fff" />
                    </div>
                    <div>
                      <div className="text-white mb-1 text-md">
                        Received Token Amount:
                      </div>
                      <div className="rounded-2xl border-[1px] flex items-center justify-between px-2 py-1 text-white">
                        {calculateGptTokenAmount(tonAmount)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 w-full font-mono flex items-center justify-center">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-100 px-4 py-3 text-sm font-medium text-black focus:outline-none"
                      onClick={depositToken}
                    >
                      Purchase Token
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <FullScreenLoader loading={loading} />
    </>
  );
};

export default DepositDialog;
