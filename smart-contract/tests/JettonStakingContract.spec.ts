import { Address, beginCell, Cell, toNano } from '@ton/core';
import {
    Blockchain,
    SandboxContract,
    TreasuryContract,
    printTransactionFees,
    prettyLogTransactions,
    RemoteBlockchainStorage,
    wrapTonClient4ForRemote,
} from '@ton/sandbox';
import '@ton/test-utils';
import { getHttpEndpoint } from '@orbs-network/ton-access';
// import { ContractSystem } from "@tact-lang/emulator";

// ---------------------------------------------------------------------------------
import { StakingContract } from '../build/StakingJettonToken/tact_StakingContract';
import { GirlfriendToken } from '../build/StakingJettonToken/tact_GirlfriendToken';
import exp from 'constants';
import { buildOnchainMetadata } from '../utils/jetton-helpers';
import { TokenNotification } from '../build/NftStake/tact_SampleJetton';
// ---------------------------------------------------------------------------------

describe('==== contract Testing ====', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nonOwner: SandboxContract<TreasuryContract>;
    let stakingContract: SandboxContract<StakingContract>;
    let jettonContract: SandboxContract<GirlfriendToken>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        const jettonParams = {
            name: 'Girlfriend Token',
            description: 'Girlfriend',
            symbol: 'Girlfriend',
            image: 'https://bafybeia7rdwltlxai7zaqmqwjjotloihbcfggiwcdszgwxyk6y42jkbsa4.ipfs.nftstorage.link/giftbox.png',
            decimals: '0',
        };

        let content = buildOnchainMetadata(jettonParams);

        // Setting the Jetton Token Root //
        jettonContract = await blockchain.openContract(
            await GirlfriendToken.fromInit(deployer.address, content, toNano(123456766689011)),
        );
        // ------------------------------------------------------------

        stakingContract = blockchain.openContract(await StakingContract.fromInit(deployer.address, 200n));
        console.log('StakingAddress: ' + stakingContract.address);

        const jettonDeployResult = await jettonContract.send(deployer.getSender(), { value: toNano(1) }, 'Mint: 100');
        expect(jettonDeployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonContract.address,
            deploy: true,
            success: true,
        });

        let stakingContract_jettonWallet = await jettonContract.getGetWalletAddress(stakingContract.address);
        console.log("StakingAddress's JettonWallet: " + stakingContract_jettonWallet);
    });

    it('Test', async () => {
        let contractAddress = await stakingContract.address;
        expect(contractAddress).toBeDefined();

        let jettonContractAddr = await jettonContract.address;
        expect(jettonContractAddr).toBeDefined();
    });

    it('Create The Jetton Deposit', async () => {
        const string_first =
            'https://nftstorage.link/ipfs/bafybeibdra4nbe6lhjnbvnyssin752bbr5i5nuqzv3aju7ehxujsngcqb4/'; // Change to the content URL you prepared
        let newContent = beginCell().storeInt(0x01, 8).storeStringRefTail(string_first).endCell();

        const message: TokenNotification = {
            $$type: 'TokenNotification',
            query_id: 1n,
            amount: toNano(1),
            from: deployer.address,
            forward_payload: newContent,
        };
        const result = await stakingContract.send(deployer.getSender(), { value: toNano('1') }, message);
        printTransactionFees(result.transactions);
        prettyLogTransactions(result.transactions);
    });
});
