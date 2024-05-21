import { Address, toNano } from '@ton/core';
import { FarmLand } from '../wrappers/FarmLand';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const farmLand = provider.open(
        FarmLand.fromAddress(Address.parse('EQDu3HQ_t1xbGgXYhWSFgxse20Ic4emqgtXKZuOgyFtOHzxx')),
    );

    await farmLand.send(
        provider.sender(),
        {
            value: toNano('0.005'),
        },
        'receive',
    );
}
