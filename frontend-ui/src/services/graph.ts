import { ApolloClient, gql, InMemoryCache } from "@apollo/client/core";
import { CHAIN } from "@tonconnect/ui-react";
import { NFT_ADDRESS } from "@/helpers";
import { GET_NFT_COLLECTION_ITEMS } from "./queries";

interface ChainGraphUrl {
  [id: string]: string;
}

export interface NftItem {
  id: string;
  address: string;
  owner: {
    id: string;
    wallet: string;
  };
  attributes: Attribute[];
  content: {
    originalUrl?: string;
  };
}

export type Attribute = {
  traitType: string;
  value: string;
};

export interface NftCollectionItem {
  items: NftItem[];
  cursor: string | null;
}

export interface Content {
  originalUrl: string;
}

const isEmptyArray = (arr: any[]) => !Array.isArray(arr) || !arr.length;

const CHAIN_GRAPH_URLS: ChainGraphUrl = {
  [CHAIN.TESTNET]: "https://api.testnet.getgems.io/graphql",
  [CHAIN.MAINNET]: "https://api.getgems.io/graphql",
};

const first = 100;

const link = (netId: CHAIN) => {
  return CHAIN_GRAPH_URLS[netId];
};

const client = (netId: CHAIN) => {
  return new ApolloClient({
    uri: link(netId),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    },
  });
};

const getNftCollectionItems = async (netId: CHAIN, after: string | null) => {
  const nftAddress = NFT_ADDRESS[netId];

  const { data } = await client(netId).query({
    context: {
      chainId: netId,
    },
    query: gql(GET_NFT_COLLECTION_ITEMS),
    variables: {
      address: nftAddress,
      first,
      after,
    },
  });

  if (!data) {
    return {
      items: [] as NftItem[],
      cursor: null,
    };
  }

  return data.nftCollectionItems as NftCollectionItem;
};

export const getAllNftCollectionItems = async (netId: CHAIN) => {
  let items: NftItem[] = [];
  let cursor = null;
  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  while (true) {
    let collectionItems = await getNftCollectionItems(netId, cursor);
    if (isEmptyArray(collectionItems.items)) {
      break;
    }
    if (collectionItems.items.length <= first) {
      items = items.concat(collectionItems.items);
      break;
    }
    cursor = collectionItems.cursor;
  }

  return items;
};
