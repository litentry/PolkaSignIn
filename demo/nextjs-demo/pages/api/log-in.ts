// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { validateSignature } from '@litentry/polkasignin-server';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address, challenge, signedMesasge } = req.body;
  if (!address) {
    res.status(400).json({ message: 'address is required' });
    return;
  }
  if (!challenge) {
    res.status(400).json({ message: 'challenge is required' });
    return;
  }
  if (!signedMesasge) {
    res.status(400).json({ message: 'signedMesasge is required' });
    return;
  }

  const valid = await validateSignature(address, challenge, signedMesasge);

  if (!valid) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

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
