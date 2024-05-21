import "../styles/globals.css";
import { AppProps } from "next/app";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { SDKProvider } from "@tma.js/sdk-react";
import { useEffect, useMemo } from "react";
import { RefreshContextProvider } from "@/contexts/Refresh/context";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { TelegramProvider } from "@/contexts/TelegramContext/TelegramProvider";
import NftProvider from "@/contexts/NftContext/NftProvider";

export default function App({ Component, pageProps }: AppProps) {
  const manifestUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return new URL(
        "tonconnect-manifest.json",
        window.location.href
      ).toString();
    }
    return "";
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") (window as any).eruda.init();
  }, []);

  return (
    <TelegramProvider>
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <SDKProvider
          options={{ acceptCustomStyles: true, cssVars: true, complete: true }}
        >
          <NftProvider>
            <RefreshContextProvider>
              <ToastContainer />
              <Component {...pageProps} />
            </RefreshContextProvider>
          </NftProvider>
        </SDKProvider>
      </TonConnectUIProvider>
    </TelegramProvider>
  );
}
