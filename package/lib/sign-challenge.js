export async function signChallenge(account, challenge) {
    // do this async in case the client is server rendered (this lib requires global window object)
    const { web3FromSource } = await import('@polkadot/extension-dapp');
    const injector = await web3FromSource(account.meta.source);
    const signRaw = injector?.signer?.signRaw;
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
