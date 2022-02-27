export type Account = {
  address: string;
  display: string;
  registration: DeriveAccountRegistration;
};

export type DeriveAccountRegistration = {
  display?: string;
  displayParent?: string;
  email?: string;
  image?: string;
  judgements?: RegistrationJudgement[];
  legal?: string;
  pgp?: string;
  riot?: string;
  twitter?: string;
  web?: string;
};

export type IdentityJudgement = {
  isErroneous?: boolean;
  isFeePaid?: boolean;
  isKnownGood?: boolean;
  isLowQuality?: boolean;
  isOutOfDate?: boolean;
  isReasonable?: boolean;
  isUnknown?: boolean;
};

export type RegistrationJudgement = {
  index?: number;
  judgement?: IdentityJudgement;
};

export type Identity = {
  address: string;
  display: string;
  registration: DeriveAccountRegistration;
};
