// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import signIn from '@litentry/polkasignin-server';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // validate the payload
  const { address, signedMessage } = req.body as {
    address: string;
    signedMessage: string;
  };
  if (!address) {
    res.status(400).json({ message: 'address is required' });
    return;
  }
  if (!signedMessage) {
    res.status(400).json({ message: 'signedMessage is required' });
    return;
  }

  // verify the signature (see ./challenge.ts for information on managing challenges)
  const { error, identity } = await signIn({
    address,
    message: 'DONT USE ME',
    signedMessage,
    provider: 'wss://polkadot.api.onfinality.io/public-ws',
  });

  if (error) {
    res.status(401).json(error);
    return;
  }

  if (!identity) {
    res.status(500).json({ message: 'Failed to fetch identity' });
    return;
  }

  // issue a token for the user to make authenticated requests to the rest of your applicationn with
  const token = jwt.sign(identity, 'SECRET', {
    expiresIn: '1hr',
  });

  res.status(200).json({ token });
}
