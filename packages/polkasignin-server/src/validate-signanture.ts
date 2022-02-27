import { cryptoWaitReady, signatureVerify } from '@polkadot/util-crypto';

export async function validateSignature(
  address: string,
  message: string,
  signedMessage: string
): Promise<boolean> {
  await cryptoWaitReady();
  const isValid = signatureVerify(message, signedMessage, address).isValid;
  return isValid;
}
