import { toNano } from '@ton/core';

import { NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from '../utils/jetton-helpers';
import { Mint, WatermelonToken } from '../build/WatermelonToken/tact_WatermelonToken';
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
        name: 'Watermelon Token',
        description: 'Watermelon',
        symbol: 'Watermelon',
        image: 'https://raw.githubusercontent.com/future-web3/image-store/main/images/watermelonIcon-preview.png',
        decimals: '0',
    };

    // Create content Cell
    let content = buildOnchainMetadata(jettonParams);
    const watermelonToken = provider.open(
        await WatermelonToken.fromInit(deployer_wallet.address, content, toNano(123456766689011)),
    );

    const mint: Mint = { $$type: 'Mint', amount: toNano(100), receiver: deployer_wallet.address };

    const deployResult = await watermelonToken.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        mint,
    );

    await provider.waitForDeploy(watermelonToken.address);
}
