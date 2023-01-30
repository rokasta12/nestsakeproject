import { IsString } from 'class-validator';

export class AuthenticateRequestDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
