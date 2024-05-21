import '@ton/test-utils';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, Cell, ContractProvider, toNano } from '@ton/core';
import { describe } from 'node:test';
import { Mint, Referral, FarmLandToken } from '../build/FarmLandToken/tact_FarmLandToken';
import { buildOnchainMetadata } from '../utils/jetton-helpers';
import { JettonDefaultWallet } from '../build/FarmLandToken/tact_JettonDefaultWallet';
import { JettonWallet } from '@ton/ton';

async function getBalance(provider: ContractProvider) {
    const { stack } = await provider.get('balance', []);
    return {
        balance: stack.readNumber(),
    };
}

describe('Farmland Token', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let player: SandboxContract<TreasuryContract>;
    let farmlandToken: SandboxContract<FarmLandToken>;
    let jettonWallet: SandboxContract<JettonDefaultWallet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        player = await blockchain.treasury('player');

        const jettonParams = {
            name: 'Farm Land Token',
            description: 'Farm Land',
            symbol: 'Farm Land',
            image: 'https://raw.githubusercontent.com/future-web3/image-store/main/images/farmland-preview-2.png',
            decimals: '0',
        };

        let content = buildOnchainMetadata(jettonParams);

        farmlandToken = blockchain.openContract(
            await FarmLandToken.fromInit(deployer.address, content, toNano(123456766689011)),
        );

        const mint: Mint = { $$type: 'Mint', amount: BigInt(100), receiver: deployer.address };

        const deployResult = await farmlandToken.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            mint,
        );

        const playerWallet = await farmlandToken.getGetWalletAddress(deployer.address);
        jettonWallet = blockchain.openContract(await JettonDefaultWallet.fromAddress(playerWallet));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: farmlandToken.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and balance are ready to use
    });

    it('should send ton to contract', async () => {
        const message: Referral = {
            $$type: 'Referral',
            referredBy: player.address,
        };

        await farmlandToken.send(
            deployer.getSender(),
            {
                value: toNano(1.1),
            },
            message,
        );

        const jettonWalletAddress = await farmlandToken.getGetWalletAddress(deployer.address);
        const playerJettonWalletAddress = await farmlandToken.getGetWalletAddress(player.address);

        const jettonWallet = blockchain.openContract(JettonWallet.create(jettonWalletAddress));
        const playerJettonWallet = blockchain.openContract(JettonWallet.create(playerJettonWalletAddress));

        const farms = await jettonWallet.getBalance();
        const playerFarms = await playerJettonWallet.getBalance();

        console.log(`deployer farms has ${farms} land, expect 1`);
        console.log(`your referral has ${playerFarms} land, expect 1`);

        expect(farms.toString()).toEqual('1');
        expect(playerFarms.toString()).toEqual('1');
    });
});
