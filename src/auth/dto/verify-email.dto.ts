import { IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  email: string;

  @IsString()
  otp: string;
}
