import {
  cryptoWaitReady,
  // decodeAddress,
  signatureVerify,
} from '@polkadot/util-crypto';
// import { u8aToHex } from '@polkadot/util';

export async function validateSignature(
  address: string,
  message: string,
  signedMessage: string
): Promise<boolean> {
  await cryptoWaitReady();
  // const publicKey = decodeAddress(address);
  // const hexPublicKey = u8aToHex(publicKey);
  const isValid = signatureVerify(message, signedMessage, address).isValid;
  return isValid;
}
