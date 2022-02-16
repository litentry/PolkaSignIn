// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { validateSignature } from '@litentry/polkasignin-server';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // validate the payload
  const { address, signedMesasge } = req.body;
  if (!address) {
    res.status(400).json({ message: 'address is required' });
    return;
  }
  if (!signedMesasge) {
    res.status(400).json({ message: 'signedMesasge is required' });
    return;
  }

  // verify the signature (see ./challenge.ts for information on managing challenges)
  const valid = await validateSignature(address, 'DONT USE ME', signedMesasge);

  if (!valid) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // issue a token for the user to make authenticated requests to the rest of your applicationn with
  const token = jwt.sign(
    {
      address,
    },
    'SECRET',
    {
      expiresIn: '1hr',
    }
  );

  res.status(200).json({ token });
}
