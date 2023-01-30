import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { Config } from 'src/config/config.schema';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: Config,
    private readonly authService: AuthService,
  ) {
    console.log(configService.auth);
    const issuer = `https://cognito-idp.${configService.aws.REGION}.amazonaws.com/${configService.aws.COGNITO_USER_POOL_ID}`;

    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 3,
        jwksUri: `${issuer}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.aws.COGNITO_CLIENT_ID,
      issuer,
      algorithms: ['RS256'],
    });
  }

  public async validate(payload: any) {
    return await this.authService.findOneByEmail(payload.email);
  }
}
