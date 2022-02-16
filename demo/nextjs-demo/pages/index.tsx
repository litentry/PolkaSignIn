import type { NextPage } from 'next';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import { injectAccounts, signChallenge } from '@litentry/polkasignin-client';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [inject, setInject] = React.useState(false);
  const [signature, setSignature] = React.useState<string>();
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
    if (selectedAccount) {
      signChallenge(selectedAccount, 'challenge')
        .then(setSignature)
        .catch(() => alert('Failed to sign'));
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
        {signature && <p>SIGNATURE: {signature}</p>}
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
