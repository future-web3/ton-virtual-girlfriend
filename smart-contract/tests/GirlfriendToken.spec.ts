import '@ton/test-utils';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, Cell, ContractProvider, toNano } from '@ton/core';
import { describe } from 'node:test';
import { Mint, Referral, GirlfriendToken } from '../build/GirlfriendToken/tact_GirlfriendToken';
import { buildOnchainMetadata } from '../utils/jetton-helpers';
import { JettonDefaultWallet } from '../build/FarmLandToken/tact_JettonDefaultWallet';
import { JettonWallet } from '@ton/ton';

async function getBalance(provider: ContractProvider) {
    const { stack } = await provider.get('balance', []);
    return {
        balance: stack.readNumber(),
    };
}

describe('Girlfriend Token', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let player: SandboxContract<TreasuryContract>;
    let girlfriendToken: SandboxContract<GirlfriendToken>;
    let contractJettonWallet: SandboxContract<JettonDefaultWallet>;
    let deployerJettonWallet: SandboxContract<JettonDefaultWallet>;
    let playerJettonWallet: SandboxContract<JettonDefaultWallet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        player = await blockchain.treasury('player');

        const jettonParams = {
            name: 'Girlfriend Token',
            description: 'Girlfriend',
            symbol: 'Girlfriend',
            image: 'https://bafybeia7rdwltlxai7zaqmqwjjotloihbcfggiwcdszgwxyk6y42jkbsa4.ipfs.nftstorage.link/giftbox.png',
            decimals: '0',
        };

        let content = buildOnchainMetadata(jettonParams);

        girlfriendToken = blockchain.openContract(
            await GirlfriendToken.fromInit(deployer.address, content, toNano(123456766689011)),
        );

        const mint: Mint = { $$type: 'Mint', amount: BigInt(100), receiver: deployer.address };

        const deployResult = await girlfriendToken.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            mint,
        );

        const deployerWallet = await girlfriendToken.getGetWalletAddress(deployer.address);
        deployerJettonWallet = blockchain.openContract(await JettonDefaultWallet.fromAddress(deployerWallet));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: girlfriendToken.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and balance are ready to use
    });

    it('should send ton to contract', async () => {
        await girlfriendToken.send(
            deployer.getSender(),
            {
                value: toNano(1.1),
            },
            'receive',
        );
    });
});
