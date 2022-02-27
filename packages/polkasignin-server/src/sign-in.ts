import { fetchIdentity } from './fetch-identity';
import { validateSignature } from './validate-signanture';
import { Identity } from './types';

export async function signIn({
  address,
  message,
  signedMessage,
  provider,
}: {
  address: string;
  message: string;
  signedMessage: string;
  provider: string;
}): Promise<{
  error?: {
    message: 'Invalid signature';
  };
  identity?: Identity;
}> {
  const isValid = await validateSignature(address, message, signedMessage);

  if (!isValid) {
    return {
      error: {
        message: 'Invalid signature',
      },
    };
  }

  const identity = await fetchIdentity(address, provider);

  return { identity };
}
