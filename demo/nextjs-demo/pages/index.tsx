import type { NextPage } from 'next';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import jwt from 'jsonwebtoken';
import { injectAccounts, signChallenge } from '@litentry/polkasignin-client';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [token, setToken] = React.useState<string>();
  const [inject, setInject] = React.useState(false);
  const [accounts, setAccounts] = React.useState<InjectedAccountWithMeta[]>();
  const [selectedAccount, setSelectedAccount] =
    React.useState<InjectedAccountWithMeta>();

  // injectAccounts triggers a permissions request from the polkadot extension
  // in this example we use inject/setInject to allow control over when to trigger
  // the permissions request
  React.useEffect(() => {
    if (inject) {
      injectAccounts('nextjs-demo').then(setAccounts);
    }
  }, [inject]);

  React.useEffect(() => {
    async function authenticate(account: InjectedAccountWithMeta) {
      // get the challenge
      const challengeResponse = await fetch('/api/challenge', {
        method: 'GET',
      });
      const { challenge } = await challengeResponse.json();

      // sign the challenge
      const signedMessage = await signChallenge(account, challenge);

      // log in
      const signInResponse = await fetch('/api/sign-in', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: account.address,
          signedMessage,
        }),
      });
      const { token: _token } = await signInResponse.json();
      setToken(_token);
    }

    if (selectedAccount) {
      authenticate(selectedAccount);
    }
  }, [selectedAccount]);

  return (
    <div className={styles.container}>
      <Head>
        <title>PolkaSign Demo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>PolkaSign Demo</h1>

        <p className={styles.description}>
          Click to inject accounts
          <button
            style={{ marginLeft: 10 }}
            onClick={() => setInject(true)}
            type="button"
          >
            Inject accounts
          </button>
        </p>

        {accounts && (
          <select
            onChange={(event) => {
              const account = accounts?.find(
                (acc) => acc.address === event.target.value
              );
              if (account) {
                setSelectedAccount(account);
              }
            }}
          >
            <option value="">Select account</option>
            {accounts?.length
              ? accounts.map((account, i) => (
                  <option key={account.address} value={account.address}>
                    {account.meta.name || account.address}
                  </option>
                ))
              : null}
          </select>
        )}
        {token && (
          <div style={{ wordWrap: 'break-word', width: 500, maxWidth: '100%' }}>
            token decoded:
            <pre>{JSON.stringify(jwt.decode(token), null, 2)}</pre>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
