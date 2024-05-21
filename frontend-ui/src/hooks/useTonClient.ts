import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "@ton/ton";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { CHAIN } from "@tonconnect/ui-react";

export function useTonClient(chain?: CHAIN) {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint({
          network: chain === CHAIN.MAINNET ? "mainnet" : "testnet",
        }),
      }),
    [chain]
  );
}
