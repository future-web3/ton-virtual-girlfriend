import React, { useEffect, useState } from "react";
import { MdOutlineToken } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import DepositDialog from "../Dialog/DepositDialog";
import axios from "axios";
import { useTelegram } from "@/contexts/TelegramContext/hooks";
import { useNft } from "@/contexts/NftContext/hooks";
import { numberFormat } from "@/helpers";

const apiUrl = process.env.NEXT_PUBLIC_VIRTUAL_MODEL_URL ?? "";

const Header: React.FC = () => {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useTelegram();
  const { triggerTokenRefresh } = useNft();
  const [remainingToken, setRemainingToken] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user) return;
        const { data } = await axios.get(`${apiUrl}/api/telegram/get`, {
          params: {
            telegramId: String(user.username ?? user.first_name),
          },
        });
        if (!data) return;
        const tokenLimit = data.user.token_limit;
        const currentTokenCount = data.user.currentTokenCount;
        const remaining = Number(tokenLimit) - Number(currentTokenCount);
        setRemainingToken(remaining < 0 ? 0 : remaining);
      } catch (err: any) {
        console.error("fetchUser error", err.message);
      }
    };
    fetchUser();
  }, [user, triggerTokenRefresh]);

  return (
    <div>
      {address && (
        <div className="flex items-center justify-center fixed mt-1 top-2 left-2 gap-3 z-50">
          <MdOutlineToken size={35} color="#FF4081" />
          <div className="text-[#FF4081] font-mono text-2xl">
            {" "}
            x{numberFormat(remainingToken, "0.0a")}
          </div>
          <button
            className="text-white rounded-xl px-3 text-xl bg-[#FF4081]"
            onClick={() => setIsOpen(true)}
          >
            Buy
          </button>
          <button
            className="cursor-pointer"
            onClick={async () => tonConnectUI.disconnect()}
          >
            <AiOutlineLogout size={20} color="#FF4081" />
          </button>
        </div>
      )}
      <DepositDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Header;
