import { before, describe } from 'node:test';
import '@ton/test-utils';
import { beginCell, toNano } from '@ton/core';
import {
    Blockchain,
    SandboxContract,
    TreasuryContract,
    printTransactionFees,
    prettyLogTransactions,
} from '@ton/sandbox';
import {
    BatchMint,
    Referral,
    ReferralWithTon,
    NftCollection,
    RoyaltyParams,
} from '../build/NftCollection/tact_NftCollection';
import {
    NftItem,
    OwnerUpdateCollectionContent,
    loadEventMintRecord,
    loadEventGptTokenPurchase,
} from '../build/NftCollection/tact_NftItem';

const decodeHexContent = (hexContent: string): string => {
    const trimmedContent = hexContent.replace(/^x\{*|}$/g, '');
    const url = Buffer.from(trimmedContent.slice(2), 'hex').toString('utf8');
    return url;
};

describe('Nft Collection', () => {
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const url = 'https://bafybeih7eskh5jxoqc35wnueqb7wr4eknpayowyp3l4ok3szpqsszj6a4y.ipfs.nftstorage.link/';
    let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(url).endCell();

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let alice: SandboxContract<TreasuryContract>;
    let bob: SandboxContract<TreasuryContract>;
    let collection: SandboxContract<NftCollection>;
    let firstItem: SandboxContract<NftItem>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        alice = await blockchain.treasury('alice');
        bob = await blockchain.treasury('bob');

        const allowOpen = false;
        let royaltiesParam: RoyaltyParams = {
            $$type: 'RoyaltyParams',
            numerator: 350n, // 350n = 35%
            denominator: 1000n,
            destination: deployer.address,
        };

        collection = blockchain.openContract(
            await NftCollection.fromInit(deployer.address, newContent, allowOpen, royaltiesParam, BigInt(10)),
        );

        const deploy_result = await collection.send(deployer.getSender(), { value: toNano(1) }, 'Mint');
        expect(deploy_result.transactions).toHaveTransaction({
            from: deployer.address,
            to: collection.address,
            deploy: true,
            success: true,
        });
    });

    it('test', async () => {
        // console.log("Next IndexID: " + (await collection.getGetCollectionData()).next_item_index);
        // console.log("Collection Address: " + collection.address);
    });

    // it('should Mint Record in detail', async () => {
    //     const deploy_result = await collection.send(deployer.getSender(), { value: toNano(1) }, 'Mint'); // Send Mint Transaction
    //     printTransactionFees(deploy_result.transactions);
    //     prettyLogTransactions(deploy_result.transactions);
    // });

    // it('should deploy correctly', async () => {
    //     await collection.send(deployer.getSender(), { value: toNano(2) }, 'Mint');
    //
    //     let current_index = (await collection.getGetCollectionData()).next_item_index;
    //     const deploy_result = await collection.send(deployer.getSender(), { value: toNano(1) }, 'Mint'); // Send Mint Transaction
    //     expect(deploy_result.transactions).toHaveTransaction({
    //         from: deployer.address,
    //         to: collection.address,
    //         success: true,
    //     });
    //     let next_index = (await collection.getGetCollectionData()).next_item_index;
    //     expect(next_index).toEqual(current_index + 1n);
    //
    //     console.log('External Message(string - base64): ' + deploy_result.externals[0].body.toBoc().toString('base64'));
    //     console.log('External Message(string - hex): ' + deploy_result.externals[0].body.toBoc().toString('hex'));
    //
    //     let loadEvent = loadEventMintRecord(deploy_result.externals[0].body.asSlice());
    //     console.log('ItemId: ' + loadEvent.item_id);
    //     console.log('Number: ' + loadEvent.generate_number);
    // });

    it('should update nft item', async () => {
        let current_index = (await collection.getGetCollectionData()).next_item_index;
        await collection.send(alice.getSender(), { value: toNano(1) }, 'Mint'); // Send Mint Transaction

        const OFFCHAIN_CONTENT_PREFIX = 0x01;
        const newUrl = 'https://nftstorage.link/ipfs/bafybeih2q773z2uptbajytejwjdoorslrstnxxejheic6pb4a7kjr64imm/';
        let updateContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(newUrl).endCell();
        const ownerUpdateMessage: OwnerUpdateCollectionContent = {
            $$type: 'OwnerUpdateCollectionContent',
            content: updateContent,
        };
        await collection.send(deployer.getSender(), { value: toNano(1) }, ownerUpdateMessage);

        let firstItemAddress = await collection.getGetNftAddressByIndex(current_index);

        if (firstItemAddress) {
            console.log(`first item address is ${firstItemAddress}`);
            firstItem = blockchain.openContract(await NftItem.fromAddress(firstItemAddress));
            const collectionAddress = await firstItem.getGetCollectionAddress();
            console.log(`collection address is ${collectionAddress}`);

            const beforeBalance = await alice.getBalance();
            console.log(`before balance: ${beforeBalance}`);
            const updateResult = await firstItem.send(alice.getSender(), { value: toNano(0.02) }, 'update');
            printTransactionFees(updateResult.transactions);
            prettyLogTransactions(updateResult.transactions);

            const afterBalance = await alice.getBalance();
            console.log(`after balance: ${afterBalance}`);

            const content = await firstItem.getGetNftData();
            const updatedUrl = decodeHexContent(content.individual_content.toString());
            console.log(updatedUrl);
            expect(updatedUrl).toEqual(`${newUrl}${current_index}.json`);
        }

        current_index = (await collection.getGetCollectionData()).next_item_index;
        await collection.send(alice.getSender(), { value: toNano(1) }, 'Mint');
        let secondItemAddress = await collection.getGetNftAddressByIndex(current_index);

        if (secondItemAddress) {
            console.log(`second item address address is ${secondItemAddress}`);
            const secondItem = blockchain.openContract(await NftItem.fromAddress(secondItemAddress));

            const content = await secondItem.getGetNftData();
            const oldUrl = decodeHexContent(content.individual_content.toString());
            console.log(oldUrl);
            expect(oldUrl).toEqual(`${url}${current_index}.json`);
        }

        const collectionBalanceBeforeWithDraw = await collection.getBalance();
        console.log('collection balance before withdraw: ', collectionBalanceBeforeWithDraw);

        await collection.send(deployer.getSender(), { value: toNano('0.05') }, 'withdraw safe');

        const collectionBalanceAfterWithDraw = await collection.getBalance();
        console.log('collection balance after withdraw: ', collectionBalanceAfterWithDraw);
    });

    it('should mint multiple NFT', async () => {
        const message: BatchMint = { $$type: 'BatchMint', number: BigInt(3) };
        const result = await collection.send(alice.getSender(), { value: toNano(3) }, message);
        printTransactionFees(result.transactions);
        prettyLogTransactions(result.transactions);

        const batchMintFirstNftAddress = await collection.getGetNftAddressByIndex(BigInt(2));
        const aliceAddress = alice.address;
        if (batchMintFirstNftAddress) {
            const batchMintFirstNft = blockchain.openContract(await NftItem.fromAddress(batchMintFirstNftAddress));
            const firstNftData = await batchMintFirstNft.getGetNftData();
            console.log(firstNftData.owner_address.toString());
            console.log(aliceAddress.toString());
            expect(firstNftData.owner_address.toString()).toEqual(aliceAddress.toString());
        }
    });

    it('should mint to referred by', async () => {
        const message: Referral = { $$type: 'Referral', referred_by: alice.address };
        const currentIndex = (await collection.getGetCollectionData()).next_item_index;
        const nextIndex = (await collection.getGetCollectionData()).next_item_index + BigInt(1);
        const result = await collection.send(bob.getSender(), { value: toNano(1) }, message);
        printTransactionFees(result.transactions);
        prettyLogTransactions(result.transactions);

        const firstNftItemAddress = await collection.getGetNftAddressByIndex(currentIndex);
        if (firstNftItemAddress) {
            const firstNftItem = blockchain.openContract(await NftItem.fromAddress(firstNftItemAddress));
            const firstNftData = await firstNftItem.getGetNftData();
            const firstNftOwner = firstNftData.owner_address;
            expect(bob.address.toString()).toEqual(firstNftOwner.toString());
        }

        const secondNftItemAddress = await collection.getGetNftAddressByIndex(nextIndex);
        if (secondNftItemAddress) {
            const secondNftItem = blockchain.openContract(await NftItem.fromAddress(secondNftItemAddress));
            const secondNftData = await secondNftItem.getGetNftData();
            const secondNftOwner = secondNftData.owner_address;
            expect(alice.address.toString()).toEqual(secondNftOwner.toString());
        }
    });

    it('should send ton to referred by', async () => {
        const aliceBalanceBeforeMint = await alice.getBalance();
        const message: ReferralWithTon = { $$type: 'ReferralWithTon', referred_by: alice.address };
        const currentIndex = (await collection.getGetCollectionData()).next_item_index;
        const result = await collection.send(bob.getSender(), { value: toNano(1) }, message);
        printTransactionFees(result.transactions);
        prettyLogTransactions(result.transactions);

        const firstNftItemAddress = await collection.getGetNftAddressByIndex(currentIndex);
        if (firstNftItemAddress) {
            const firstNftItem = blockchain.openContract(await NftItem.fromAddress(firstNftItemAddress));
            const firstNftData = await firstNftItem.getGetNftData();
            const firstNftOwner = firstNftData.owner_address;
            expect(bob.address.toString()).toEqual(firstNftOwner.toString());
        }

        const aliceBalanceAfterMint = await alice.getBalance();
        const difference = aliceBalanceAfterMint - aliceBalanceBeforeMint;
        expect(Number(difference.toString())).toBeGreaterThan(0);
    });

    it('should purchase gpt token', async () => {
        let result = await collection.send(alice.getSender(), { value: toNano(1) }, 'GptTokenPurchase');
        let loadEvent = loadEventGptTokenPurchase(result.externals[0].body.asSlice());
        expect(loadEvent.buyer.toString()).toEqual(alice.address.toString());
        expect(loadEvent.payment).toEqual(toNano(1));
    });
});
