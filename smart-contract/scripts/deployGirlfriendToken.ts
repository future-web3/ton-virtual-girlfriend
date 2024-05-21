import { toNano } from '@ton/core';

import { NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from '../utils/jetton-helpers';
import { Mint, GirlfriendToken } from '../build/GirlfriendToken/tact_GirlfriendToken';
import { TonClient4, WalletContractV4 } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';

export async function run(provider: NetworkProvider) {
    const client4 = new TonClient4({
        endpoint: 'https://sandbox-v4.tonhubapi.com',
        // endpoint: "https://mainnet-v4.tonhubapi.com",
    });

    let mnemonics = (process.env.mnemonics_2 || '').toString(); // 🔴 Change to your own, by creating .env file!
    let keyPair = await mnemonicToPrivateKey(mnemonics.split(' '));
    let secretKey = keyPair.secretKey;
    let workchain = 0; //we are working in basechain.
    let deployer_wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });

    const jettonParams = {
        name: 'Girlfriend Token',
        description: 'Girlfriend',
        symbol: 'Girlfriend',
        image: 'https://bafybeia7rdwltlxai7zaqmqwjjotloihbcfggiwcdszgwxyk6y42jkbsa4.ipfs.nftstorage.link/giftbox.png',
        decimals: '0',
    };

    // Create content Cell
    let content = buildOnchainMetadata(jettonParams);
    const girlfriendToken = provider.open(
        await GirlfriendToken.fromInit(deployer_wallet.address, content, BigInt(125000)),
    );

    const mint: Mint = { $$type: 'Mint', amount: BigInt(100), receiver: deployer_wallet.address };

    const deployResult = await girlfriendToken.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        mint,
    );

    await provider.waitForDeploy(girlfriendToken.address);
}
