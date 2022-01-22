
export class Web3SignInNonceResponse {

    identityNetwork?: string;

    callbackEndpoint?: string;

    scope?: string[];

    challenge!: string;

    nonce!: string
}