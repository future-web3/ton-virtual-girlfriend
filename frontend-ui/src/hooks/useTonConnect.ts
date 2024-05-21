import { useTonConnectUI } from "@tonconnect/ui-react";
import { Sender, SenderArguments } from "@ton/core";
import { useState } from "react";

export function useTonConnect(): {
  sender: Sender;
  boc: string;
} {
  const [tonConnectUI] = useTonConnectUI();
  const [boc, setBoc] = useState("");

  return {
    sender: {
      send: async (args: SenderArguments) => {
        setBoc("");
        const result = await tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
        setBoc(result.boc);
      },
    },
    boc,
  };
}
