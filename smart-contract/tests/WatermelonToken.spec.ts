import '@ton/test-utils';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, ContractProvider, toNano } from '@ton/core';
import { describe } from 'node:test';
import { Mint, WatermelonToken } from '../build/WatermelonToken/tact_WatermelonToken';
import { buildOnchainMetadata } from '../utils/jetton-helpers';
import { JettonDefaultWallet } from '../build/WatermelonToken/tact_JettonDefaultWallet';

async function getBalance(provider: ContractProvider) {
    const { stack } = await provider.get('balance', []);
    return {
        balance: stack.readNumber(),
    };
}

describe('Watermelon Token', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let watermelonToken: SandboxContract<WatermelonToken>;
    let jettonWallet: SandboxContract<JettonDefaultWallet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        const jettonParams = {
            name: 'Farm Land Token',
            description: 'Farm Land',
            symbol: 'Farm Land',
            image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7691.png',
            decimals: '0',
        };

        let content = buildOnchainMetadata(jettonParams);

        watermelonToken = blockchain.openContract(
            await WatermelonToken.fromInit(deployer.address, content, toNano(123456766689011)),
        );

        const mint: Mint = { $$type: 'Mint', amount: toNano(100000), receiver: deployer.address };

        const deployResult = await watermelonToken.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            mint,
        );

        const playerWallet = await watermelonToken.getGetWalletAddress(deployer.address);
        jettonWallet = blockchain.openContract(await JettonDefaultWallet.fromAddress(playerWallet));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: watermelonToken.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and balance are ready to use
    });

    it('should get deployer token balance', async () => {
        const walletData = await jettonWallet.getGetWalletData();
        console.log(walletData);
    });
});
