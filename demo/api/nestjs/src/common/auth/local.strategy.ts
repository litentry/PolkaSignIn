import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthUser } from './authUser';
import { IAuthService } from './IAuthService';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject('LOCAL_AUTH_SERVICE') private readonly authService: IAuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<AuthUser> {
        if (this.authService) {
            // console.log(this.authService);

            return this.authService.validateUser(username, password);
        }
        else {
            throw new NotFoundException('authService is null');
        }


    }
}

