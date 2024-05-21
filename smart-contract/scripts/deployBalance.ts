import { toNano } from '@ton/core';
import { BalanceSheet } from '../wrappers/Balance';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const balance = provider.open(await BalanceSheet.fromInit());
    // const balance = provider.open(await Balance.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await balance.send(
        provider.sender(),
        {
            value: toNano('0.005'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(balance.address);
}
