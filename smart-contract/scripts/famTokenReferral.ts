import { Address, toNano } from '@ton/core';
import { FarmLandToken, Referral } from '../wrappers/FarmLandToken';
import { NetworkProvider } from '@ton/blueprint';
import { mnemonicToPrivateKey } from '@ton/crypto';
import { WalletContractV4 } from '@ton/ton';
import { buildOnchainMetadata } from '../utils/jetton-helpers';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse('EQB4DV6PAntJWQ2X1ydjyuraKORioqWrqoDy31jDz0_guDIc');
    const userAddress = Address.parse('EQC_c92sXr7wZxtf_hIZJULfmQaJsFXX1Sh3WKb7Na-i_PH9');

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const farmLandToken = provider.open(FarmLandToken.fromAddress(address));

    const message: Referral = {
        $$type: 'Referral',
        referredBy: Address.parse('0QBH5tXPhJJB1GCmM4-XGfw1Sj8kaLQ3XQfP9ZUplVQxNhVU'),
    };

    await farmLandToken.send(
        provider.sender(),
        {
            value: toNano(5),
        },
        message,
    );

    ui.clearActionPrompt();
    ui.write('Send Successful');
}
