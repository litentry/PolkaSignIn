import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

type SignerResult = {
  id: number;
  signature: string;
};

type SignerPayloadRaw = {
  data: string;
  type: 'bytes' | 'payload';
  address: string;
};

type SignRaw = (raw: SignerPayloadRaw) => Promise<SignerResult>;

export async function signChallenge(
  account: InjectedAccountWithMeta,
  challenge: string
): Promise<string> {
  // do this async in case the client is server rendered (this lib requires global window object)
  const { web3FromSource } = await import('@polkadot/extension-dapp');

  const injector = await web3FromSource(account.meta.source);

  const signRaw = injector?.signer?.signRaw as SignRaw | undefined;

  if (signRaw) {
    const { signature } = await signRaw({
      type: 'payload',
      address: account.address,
      data: challenge,
    });

    return signature;
  }

  throw new Error('Account has no signer');
}
