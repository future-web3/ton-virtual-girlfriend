import { useContext } from "react";
import { NftContext } from "./NftProvider";

export const useNft = () => useContext(NftContext);
