import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from './common/auth/authUser';

@Injectable()
export class AppService {
    private nonceCache: any = {};

    constructor(private readonly jwtService: JwtService) {
    }
    async grantToken(user: AuthUser): Promise<string> {
        const payload = { username: user.username, sub: user.userId };
        let token = this.jwtService.sign(payload);
        return token;

    }
    checkWeb3User(userName: string): AuthUser {
        //TODO  check the user in system
        let userId = 1;
        return { userId: userId, username: userName }
    }


    removeNonce(nonce: string) {
        delete this.nonceCache[nonce];
    }
    getNonce(nonce: string) {
        return this.nonceCache[nonce];
    }
    addNonce(nonce: string, value: string) {
        this.nonceCache[nonce] = value;
    }

}
