
export class Web3SignInChallengeRequest {

    identityNetwork?: string;

    scope?: string[];

    challenge!: string;

    nonce!: string;

    signature!: string;

    address!: string;
} 