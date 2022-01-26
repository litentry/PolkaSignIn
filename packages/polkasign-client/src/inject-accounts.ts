import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

/**
 * Connects to the Polkadot browser extension and requests access to accounts.s
 */
export async function injectAccounts(
  appName: string
): Promise<InjectedAccountWithMeta[]> {
  // do this async in case the client is server rendered (this lib requires global window object)
  const { web3Enable, web3Accounts } = await import('@polkadot/extension-dapp');

  const extensions = await web3Enable(appName);

  if (!extensions.length) {
    throw new Error('Polkadot extension not found');
  }

  const accounts = await web3Accounts();

  return accounts;
}
