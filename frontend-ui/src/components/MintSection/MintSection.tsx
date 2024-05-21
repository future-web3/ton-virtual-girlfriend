import React, { useEffect } from "react";
import Image from "next/image";
import MintProgress from "./MintProgress";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import MintButton from "./MintButton";
import { useCollectionContract } from "@/hooks/useCollectionContract";
import { useTelegram } from "@/contexts/TelegramContext/hooks";
import axios from "axios";
import { useNft } from "@/contexts/NftContext/hooks";

const apiUrl = process.env.NEXT_PUBLIC_VIRTUAL_MODEL_URL ?? "";

const MintSection: React.FC = () => {
  const rawAddress = useTonAddress(false);
  const { currentIndex } = useCollectionContract(true);
  const { user } = useTelegram();
  const { onSetTriggerTokenRefresh } = useNft();

  useEffect(() => {
    const login = async () => {
      if (!user) return;
      try {
        const userFriendlyAddress = Address.parseRaw(rawAddress).toString();
        console.log(userFriendlyAddress);
        const { data } = await axios.post(`${apiUrl}/api/telegram/login`, {
          telegramId: String(user.username ?? user.first_name),
          walletAddress: userFriendlyAddress,
        });
        const token = data.token;
        localStorage.setItem("jwt", token);
        onSetTriggerTokenRefresh();
      } catch (error: any) {
        console.error("login error", error.message);
      }
    };
    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, rawAddress]);

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="w-full flex justify-center my-8">
        <Image
          src="/images/LimitedMinting.webp"
          alt="title"
          height={350}
          width={350}
        />
      </div>
      <MintProgress mintedData={currentIndex} />
      <div className="mx-auto flex justify-center items-center bg-slate-50 mt-12 mb-10 w-[200px] h-[200px] rounded-2xl">
        <Image
          src={`/images/coming.png`}
          alt="blind box image"
          width={200}
          height={200}
          className="rounded-2xl border-2 border-[#ff4081]"
        />
      </div>
      {rawAddress ? (
        <div className="mb-5">
          <MintButton />
        </div>
      ) : (
        <div className="w-full flex justify-center items-center">
          <TonConnectButton />
        </div>
      )}
      {!rawAddress && <div className="my-10" />}
    </div>
  );
};

export default MintSection;
