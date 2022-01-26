import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
/**
 * Connects to the Polkadot browser extension and requests access to accounts.s
 */
export declare function injectAccounts(appName: string): Promise<InjectedAccountWithMeta[]>;
