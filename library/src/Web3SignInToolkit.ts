import { Web3SignInChallengeRequest } from "./model/Web3SignInChallengeRequest";
import { Web3SignInChallengeResponse } from "./model/Web3SignInChallengeResponse";
import { Web3SignInNonceRequest } from "./model/Web3SignInNonceRequest";
import { Web3SignInNonceResponse } from "./model/Web3SignInNonceResponse";
import {
    cryptoWaitReady,
    decodeAddress,
    signatureVerify,
} from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";
export class Web3SignInToolkit {
    async createChallenge(request: Web3SignInNonceRequest, challenge: string, nonce: string): Promise<Web3SignInNonceResponse> {
        let resp: Web3SignInNonceResponse = {
            identityNetwork: request.identityNetwork,
            callbackEndpoint: '',
            scope: [],
            challenge: challenge,
            nonce: nonce
        };
        return resp;
    }

    async challenge(request: Web3SignInChallengeRequest): Promise<Web3SignInChallengeResponse> {

        console.debug('challenge:', request);

        let resp: Web3SignInChallengeResponse = {
            ...request,
            verified: false,
            extra: ''
        };
        let challenge = request.challenge;
        let signature = request.signature;
        let address = request.address;

        resp.verified = await this.isValidSignature(
            challenge,
            signature,
            address
        );

        return resp;
    }
    async isValidSignature(signedMessage: string, signature: string, address: string): Promise<boolean> {
        await cryptoWaitReady();
        const publicKey = decodeAddress(address);
        const hexPublicKey = u8aToHex(publicKey);
        console.debug(`signedMessage:${signedMessage},signature:${signature},hexPublicKey:${hexPublicKey}`);

        let isValid = signatureVerify(signedMessage, signature, hexPublicKey)
            .isValid;
        console.debug("isValidSignature:", isValid);
        return isValid;
    }
}