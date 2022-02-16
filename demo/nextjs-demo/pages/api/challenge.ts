import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  challenge: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  /**
   * The challenge string must be rotated and unpredictable, then way if anybody gets hold of the signed message (sent to /log-in in this demo) it cannot be used to log in again once the challenge is rotated. Currently this is the responsibility of the developer implementing the server side of PolkaSignIn.
   *
   * Whilst this is no different to somebody getting hold of a password in a POST request, the risk can be avoided with challenge rotation so it should be. One approach would be to issue random UUIDs and store them in a database (indexed against the user address) with a very short expiry date, then query the challenge just before validating.
   */
  res.status(200).json({
    challenge: 'DONT USE ME',
  });
}
