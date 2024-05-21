import React, { createContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export interface Farm {
  triggerRefresh: number;
  triggerTokenRefresh: number;
  onSetTriggerRefresh: () => void;
  onSetTriggerTokenRefresh: () => void;
}

export const NftContext = createContext<Farm>({
  triggerRefresh: 0,
  triggerTokenRefresh: 0,
  onSetTriggerRefresh: () => undefined,
  onSetTriggerTokenRefresh: () => undefined,
});

const NftProvider: React.FC<Props> = ({ children }) => {
  const [triggerRefresh, setTriggerRefresh] = useState<number>(0);
  const [triggerTokenRefresh, setTriggerTokenRefresh] = useState(0);
  const onSetTriggerRefresh = () => setTriggerRefresh((x) => x + 1);
  const onSetTriggerTokenRefresh = () => setTriggerTokenRefresh((x) => x + 1);

  return (
    <NftContext.Provider
      value={{
        triggerRefresh,
        triggerTokenRefresh,
        onSetTriggerRefresh,
        onSetTriggerTokenRefresh,
      }}
    >
      {children}
    </NftContext.Provider>
  );
};

export default NftProvider;
