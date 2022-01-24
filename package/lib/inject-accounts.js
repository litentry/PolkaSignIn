import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
/**
 * Connects to the Polkadot browser extension and requests access to accounts.s
 */
export async function injectAccounts(appName) {
    const extensions = await web3Enable(appName);
    if (!extensions.length) {
        throw new Error('Polkadot extension not found');
    }
    const accounts = await web3Accounts();
    return accounts;
}
