import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  challenge: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ challenge: 'Example' });
}
