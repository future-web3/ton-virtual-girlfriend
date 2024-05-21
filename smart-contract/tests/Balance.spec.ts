import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { BalanceSheet } from '../wrappers/Balance';
import '@ton/test-utils';

describe('Balance', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let balance: SandboxContract<BalanceSheet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        balance = blockchain.openContract(await BalanceSheet.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await balance.send(
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
            to: balance.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and balance are ready to use
    });

    it('should receive money', async () => {
        const amountToSend = toNano('0.1');
        await deployer.send({
            to: balance.address,
            value: amountToSend,
        });

        const updatedBalance = toNano(await balance.getBalance());
        const allowedError = BigInt(5000000);
        const difference =
            updatedBalance > amountToSend ? updatedBalance - amountToSend : amountToSend - updatedBalance;

        console.log(`Updated balance is: ${updatedBalance}`);
        console.log(`Expected balance was: ${amountToSend}`);
        console.log(`Difference is: ${difference}`);

        expect(difference).toBeLessThanOrEqual(allowedError);
    });

    // it('should increase counter', async () => {
    //     const increaseTimes = 3;
    //     for (let i = 0; i < increaseTimes; i++) {
    //         console.log(`increase ${i + 1}/${increaseTimes}`);
    //
    //         const increaser = await blockchain.treasury('increaser' + i);
    //
    //         const counterBefore = await balance.getCounter();
    //
    //         console.log('counter before increasing', counterBefore);
    //
    //         const increaseBy = BigInt(Math.floor(Math.random() * 100));
    //
    //         console.log('increasing by', increaseBy);
    //
    //         const increaseResult = await balance.send(
    //             increaser.getSender(),
    //             {
    //                 value: toNano('0.05'),
    //             },
    //             {
    //                 $$type: 'Add',
    //                 queryId: 0n,
    //                 amount: increaseBy,
    //             }
    //         );
    //
    //         expect(increaseResult.transactions).toHaveTransaction({
    //             from: increaser.address,
    //             to: balance.address,
    //             success: true,
    //         });
    //
    //         const counterAfter = await balance.getCounter();
    //
    //         console.log('counter after increasing', counterAfter);
    //
    //         expect(counterAfter).toBe(counterBefore + increaseBy);
    //     }
    // });
});
