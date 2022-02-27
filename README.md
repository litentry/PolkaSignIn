# PolkaSignIn

## Demo (NextJS server & client)

```
yarn
cd demo/nextjs-demo
yarn dev
```

Relevant files in the demo:

- `demo/nextjs-demo/pages/index.ts` (client implementation)
- `demo/nextjs-demo/api/challenge.ts` (server challenge implementation)
- `demo/nextjs-demo/api/log-in.ts` (server log in implementation)

## Client Side Implementation

Request accounts from Polkadot browser extension:

```typescript
import { injectAccounts, signChallenge } from '@litentry/polkasignin-client';

const accounts = await injectAccounts('name-of-your-website')
```

Ask the user to select the account they wish to log in with, then request a challenge from the server:

```typescript
// some UI to allow them to select from the array returned in the step above, then:

const challengeResponse = await fetch(`https://your-server-domain/challenge?address=${USER_ADDRESS}`, {
  method: 'GET',
});
const { challenge } = await challengeResponse.json();
```

Trigger the Polkadot extension's message signing screen:

```typescript
const signedMesasge = await signChallenge(account, challenge);
```

Log in to the server:

```typescript
const signInResponse = await fetch('https://your-server-domain/sign-in', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    address: account.address,
    signedMesasge,
  }),
});
const { token } = await signInResponse.json();
```

## Server Side Implementation

The implementation of the challenge request handler is currently the responsibility of the developer implementing the server side of PolkaSignIn. The challenge string must be rotated and unpredictable, then if anybody gets hold of the signed message it cannot be used to log in again once the challenge is rotated.

Whilst this is no different to somebody getting hold of a password by spying on a POST request, the risk can be avoided with challenge rotation so it should be. One approach would be to issue random UUIDs and store them in a database (indexed against the user address) with a very short expiry date, then query the challenge just before validating.

```typescript
async function handler(
  req: Request,
  res: Response
) {
  const { address } = req.query
  const challenge = uuid();
  const expiry = new Date(new Date().getTime() + 10*60000); // 10 minutes from now

  // store challenge, address & expiry

  // return challenge to client
  res.status(200).json({ challenge });
}
```

The sign in handler in your application should use the `signIn` method to validate the signature and fetch the user's identity from the chain specified

```typescript
async function handler(
  req: Request,
  res: Response
) {
  const { address, signedMesasge } = req.body;

  // get challenge (checking expiry) from your data store

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
```