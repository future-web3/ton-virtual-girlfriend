import '@ton/test-utils';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, Cell, ContractProvider, toNano } from '@ton/core';
import { describe } from 'node:test';
import { FarmLand, Referral, loadFarmMintEvent } from '../build/FarmLand/tact_FarmLand';

async function getBalance(provider: ContractProvider) {
    const { stack } = await provider.get('balance', []);
    return {
        balance: stack.readNumber(),
    };
}

describe('Farmland', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let player: SandboxContract<TreasuryContract>;
    let referral: SandboxContract<TreasuryContract>;
    let farmland: SandboxContract<FarmLand>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        player = await blockchain.treasury('player');
        referral = await blockchain.treasury('referral');

        farmland = blockchain.openContract(await FarmLand.fromInit());

        const deployResult = await farmland.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: farmland.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and balance are ready to use
    });

    it('should add farm count to deployer if no referral', async () => {
        const amountSend = toNano('1.1');

        const message: Referral = { $$type: 'Referral', referral: player.address };

        await farmland.send(
            player.getSender(),
            {
                value: amountSend,
            },
            message,
        );

        let farmCount: any = await farmland.getFarmCount(player.address);

        expect(farmCount.toString()).toEqual('1');
    });

    it('should add farm count to referral', async () => {
        const amountSend = toNano('1.1');

        const message: Referral = { $$type: 'Referral', referral: referral.address };

        await farmland.send(
            referral.getSender(),
            {
                value: amountSend,
            },
            message,
        );

        let referralFarmCount = await farmland.getFarmCount(referral.address);
        expect(referralFarmCount?.toString()).toEqual('1');

        const playerMessage: Referral = { $$type: 'Referral', referral: referral.address };
        await farmland.send(
            player.getSender(),
            {
                value: amountSend,
            },
            playerMessage,
        );

        let playerFarmCount = await farmland.getFarmCount(player.address);
        expect(playerFarmCount?.toString()).toEqual('1');

        referralFarmCount = await farmland.getFarmCount(referral.address);
        expect(referralFarmCount?.toString()).toEqual('2');
    });
});
