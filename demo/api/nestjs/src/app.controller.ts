import { BadRequestException, Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/auth/JwtAuthGuard';
import { AuthUser } from 'src/common/auth/authUser';
import {
  Web3SignInToolkit,
  Web3SignInNonceResponse, Web3SignInNonceRequest, Web3SignInChallengeRequest, Web3SignInChallengeResponse,
} from 'web3-sign-in-toolkit/lib';
import { UserInfo } from './userInfo';
import { AppService } from './app.service';

const { v4: uuidv4 } = require('uuid');

@ApiTags('web3-sign-in')
@Controller('/web3')
export class AppController {
  constructor(private readonly web3SignInHelper: Web3SignInToolkit, private readonly appService: AppService) {
  }

  @Post('/nonce')
  @ApiOperation({ summary: '[Web3] create a nonce message for signin request' })
  @ApiOkResponse({ type: Web3SignInNonceResponse })
  async nonce(@Body() request: Web3SignInNonceRequest): Promise<Web3SignInNonceResponse> {

    let nonce = 'web3-signin-' + new Date().getTime() + '-' + uuidv4().substring(0, 6);
    let challenge = "challenge message to signin at " + new Date().toISOString();
    let resp = await this.web3SignInHelper.createChallenge(request, challenge, nonce)

    this.appService.addNonce(nonce, JSON.stringify(resp));

    return resp;
  }

  @Post('/challenge')
  @ApiOperation({ summary: '[Web3] verify the nonce message and signature' })
  @ApiOkResponse({ type: Web3SignInChallengeResponse })
  async challenge(@Body() request: Web3SignInChallengeRequest): Promise<Web3SignInChallengeResponse> {
    try {

      let challenge = request.challenge;
      let nonce = request.nonce;
      if (!challenge) {
        throw new BadRequestException('challenge invalid');
      } if (!nonce) {
        throw new BadRequestException('nonce invalid');
      }

      //check nonce exist
      let nonceCached = await this.appService.getNonce(nonce);
      if (nonceCached) {

        //verify signature
        let resp = await this.web3SignInHelper.challenge(request);

        //remove nonce
        this.appService.removeNonce(nonce);

        if (resp.verified) {
          //add user 
          let userName = request.address;
          let validateUser: AuthUser = await this.appService.checkWeb3User(userName);
          let token = await this.appService.grantToken(validateUser);
          if (token) {
            resp.extra = token;
          }
        }
        else {
          throw new BadRequestException('challenge failed');
        }
        return resp;
      } else {
        throw new BadRequestException('nonce not exist');
      }

    } catch (error) {
      console.error(error);
      throw new BadRequestException('request invalid, ' + error);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/sign_out')
  @ApiOperation({ summary: '[Web3] sign out from service side' })
  @ApiOkResponse({ type: Boolean })
  async sign_out(@Request() request): Promise<Boolean> {
    let validateUser: AuthUser = request.user;
    let userId = validateUser.userId;
    console.log(`userId ${userId} sign out from service side`)
    return true;
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/userInfo')
  @ApiOperation({
    summary: 'get current user info',
    description: 'add [Authorization] in http header. Format:  "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm..." '
  })
  @ApiOkResponse({ type: UserInfo })
  async userInfo(@Request() request): Promise<UserInfo> {
    // console.log(request);
    let validateUser: AuthUser = request.user;
    let userId = validateUser.userId;
    return { userId: userId, displayName: validateUser.username };
  }

}
