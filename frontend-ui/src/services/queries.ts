export const GET_NFT_COLLECTION_ITEMS = `
  query NftCollectionItems($address: String!, $first: Int! ) {
    nftCollectionItems(address: $address, first: $first) {
      items {
        id,
        address
        owner{
          id,
          wallet
        }
        attributes {
          traitType
          value
        }
        description
        content {
          ... on NftContentImage {
            originalUrl
          }
        }
      }
      cursor
    }
  }
`;
