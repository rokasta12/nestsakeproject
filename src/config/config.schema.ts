import { IsString, Allow } from 'class-validator';
import { Type } from 'class-transformer';

export class AWSConfig {
  @IsString()
  region: string;

  @IsString()
  cognito_user_pool_id: string;

  @IsString()
  cognito_client_id: string;

  get REGION() {
    return this.region;
  }

  get COGNITO_USER_POOL_ID() {
    return this.cognito_user_pool_id;
  }

  get COGNITO_CLIENT_ID() {
    return this.cognito_client_id;
  }
}

export class DBConfig {
  @IsString()
  uri: string;

  get URI() {
    return this.uri;
  }
}

export class AuthConfig {
  @IsString()
  jwt_secret: string;

  get JWT_SECRET() {
    return this.jwt_secret;
  }
}

export class Config {
  @Type(() => AWSConfig)
  @Allow()
  aws: AWSConfig;

  @Type(() => AuthConfig)
  @Allow()
  auth: AuthConfig;

  @Type(() => DBConfig)
  @Allow()
  database: DBConfig;
}
