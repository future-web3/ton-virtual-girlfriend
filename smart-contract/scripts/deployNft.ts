import { address, Address, beginCell, Cell, OpenedContract, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { NftCollection, BatchMint, RoyaltyParams } from '../build/NftCollection/tact_NftCollection';
import { loadEventGptTokenPurchase, NftItem, OwnerUpdateCollectionContent } from '../build/NftCollection/tact_NftItem';
import { TonClient4, WalletContractV4, contractAddress } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';

const mint = async (
    provider: NetworkProvider,
    deployer_wallet: WalletContractV4,
    newContent: Cell,
    allowOpen: boolean,
    royalParams: RoyaltyParams,
    totalSupply: number,
) => {
    const nft = provider.open(
        await NftCollection.fromInit(deployer_wallet.address, newContent, allowOpen, royalParams, BigInt(totalSupply)),
    );

    await nft.send(provider.sender(), { value: toNano('0.5') }, 'Mint');
};

const batchMint = async (
    provider: NetworkProvider,
    nftCollectionContract: OpenedContract<NftCollection>,
    amount: number,
) => {
    const message: BatchMint = {
        $$type: 'BatchMint',
        number: BigInt(3),
    };

    await nftCollectionContract.send(provider.sender(), { value: toNano('3') }, message);
};

const getNftCollectionFromAddress = (provider: NetworkProvider, address: Address) => {
    const nftOnline = provider.open(NftCollection.fromAddress(address));
    return nftOnline;
};

const allowBoxOpen = async (
    provider: NetworkProvider,
    nftCollectionContract: OpenedContract<NftCollection>,
    updatedUrl: string,
) => {
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    let updatedContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(updatedUrl).endCell();

    const ownerUpdateCollectionContent: OwnerUpdateCollectionContent = {
        $$type: 'OwnerUpdateCollectionContent',
        content: updatedContent,
    };

    await nftCollectionContract.send(provider.sender(), { value: toNano('0.45') }, ownerUpdateCollectionContent);
};

const withdraw = async (provider: NetworkProvider, nftCollectionContract: OpenedContract<NftCollection>) => {
    await nftCollectionContract.send(provider.sender(), { value: toNano('0.45') }, 'withdraw safe');
};

const getNftItemAddressByIndex = async (nftCollectionContract: OpenedContract<NftCollection>, index: number) => {
    const nftItemAddress = await nftCollectionContract.getGetNftAddressByIndex(BigInt(1));
    return nftItemAddress;
};

const openBox = async (provider: NetworkProvider, nftItemAddress: Address) => {
    const firstNftItem = provider.open(NftItem.fromAddress(nftItemAddress));
    const content = await firstNftItem.getGetNftData();
    // console.log(content);
    await firstNftItem.send(provider.sender(), { value: toNano('1') }, 'update');
};

const purchaseGptToken = async (provider: NetworkProvider, nftCollectionAddress: Address) => {
    const nftCollection = provider.open(NftCollection.fromAddress(nftCollectionAddress));
    await nftCollection.send(provider.sender(), { value: toNano('1') }, 'GptTokenPurchase');
};

export async function run(provider: NetworkProvider) {
    let mnemonics = (process.env.mnemonics_2 || '').toString(); // 🔴 Change to your own, by creating .env file!
    let keyPair = await mnemonicToPrivateKey(mnemonics.split(' '));
    let secretKey = keyPair.secretKey;
    let workchain = 0; //we are working in basechain.
    let deployer_wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });

    // Parameters for NFTs
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const string_first = 'https://nftstorage.link/ipfs/bafybeibdra4nbe6lhjnbvnyssin752bbr5i5nuqzv3aju7ehxujsngcqb4/'; // Change to the content URL you prepared
    let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();

    const allowOpen = false;

    const royalParams: RoyaltyParams = {
        $$type: 'RoyaltyParams',
        numerator: 350n, // 350n = 35%
        denominator: 1000n,
        destination: deployer_wallet.address,
    };

    //if need to interact with existing contract, comment bellow line
    // await mint(provider, deployer_wallet, newContent, allowOpen, royalParams, 20);

    const nftOnline = getNftCollectionFromAddress(
        provider,
        Address.parse('0QDjCaAh1Kh4W3dNUwEgTWxsgWs488aKWp5sGK-2WOk0rcdF'),
    );

    //if not executed, comment bellow lines

    // await batchMint(provider, nftOnline, 3);

    const updatedUrl = 'https://nftstorage.link/ipfs/bafybeiaduqhdrucgdrmmkkua2qzdwxbtbvkbekszu5n5xtcn6zc3v4hkae/';
    await allowBoxOpen(provider, nftOnline, updatedUrl);

    // const collectionData = await nftOnline.getGetCollectionData();
    // console.log(collectionData);

    // const nftItemAddress = await getNftItemAddressByIndex(nftOnline, 1);
    // console.log(nftItemAddress);

    // if (nftItemAddress) {
    //     await openBox(provider, nftItemAddress);
    // }

    // await purchaseGptToken(provider, Address.parse('kQCpBBrZup-zuhwlTgU83ex6pR0zj9i2QUfaxmFU656txHRi'));

    await withdraw(provider, nftOnline);
}
