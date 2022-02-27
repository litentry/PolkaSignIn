import { ApiPromise, WsProvider } from '@polkadot/api';
import { RegistrationJudgement } from './types';

let api: ApiPromise;

async function getApi(provider: string) {
  if (api) return api;

  api = await ApiPromise.create({ provider: new WsProvider(provider) });

  return api;
}

export async function fetchIdentity(address: string, provider: string) {
  const _api = await getApi(provider);

  const info = await _api.derive.accounts.info(address);

  const display = info.identity.displayParent
    ? `${info.identity.displayParent}/${
        info.identity.display || info.identity.displayParent
      }`
    : info.identity.display ?? address;

  return {
    address: address,
    registration: {
      ...info.identity,
      judgements: info.identity.judgements.map<RegistrationJudgement>(
        ([index, judgement]) => ({
          index: index.toNumber(),
          judgement: {
            isErroneous: judgement.isErroneous,
            isFeePaid: judgement.isFeePaid,
            isKnownGood: judgement.isKnownGood,
            isLowQuality: judgement.isLowQuality,
            isOutOfDate: judgement.isOutOfDate,
            isReasonable: judgement.isReasonable,
            isUnknown: judgement.isUnknown,
          },
        })
      ),
    },
    display: display.toUpperCase(),
  };
}
