import React from "react";
import { useTelegram } from "@/contexts/TelegramContext/hooks";
import Bottom from "../Navigation/Bottom";
import Header from "../Navigation/Header";
import { useTonAddress } from "@tonconnect/ui-react";
import { TonConnectButton } from "@tonconnect/ui-react";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const { user } = useTelegram();

  if (!user) return null;

  return (
    <div className="relative overflow-hidden md:hidden block">
      <Header />
      {children}
      <Bottom />
    </div>
  );
};

export default Layout;
