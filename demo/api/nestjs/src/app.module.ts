import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Web3SignInToolkit } from 'web3-sign-in-toolkit/lib';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { jwtConstants } from './common/auth/constants';
import { JwtStrategy } from './common/auth/jwt.strategy';

@Module({
  imports: [PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    Web3SignInToolkit],
})
export class AppModule { }
