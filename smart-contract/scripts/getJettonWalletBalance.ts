import { Address, toNano } from '@ton/core';
import { WatermelonToken } from '../wrappers/WatermelonToken';
import { NetworkProvider } from '@ton/blueprint';
import { JettonMaster, JettonWallet } from '@ton/ton';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse('EQDh297qVPyC5snhCQymUThGE3yFxmuloskscCqyVbpgXTEg');
    const userAddress = Address.parse('EQC_c92sXr7wZxtf_hIZJULfmQaJsFXX1Sh3WKb7Na-i_PH9');

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const watermelonToken = provider.open(WatermelonToken.fromAddress(address));
    const jettonWalletAddress = await watermelonToken.getGetWalletAddress(userAddress);

    ui.write(`jettonWalletAddress: ${jettonWalletAddress}`);

    const jettonWallet = provider.open(JettonWallet.create(jettonWalletAddress));
    const watermelons = await jettonWallet.getBalance();

    ui.clearActionPrompt();
    ui.write(`Jetton balance: ${watermelons.toString()}`);
}
