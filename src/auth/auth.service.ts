import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { Config } from 'src/config/config.schema';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { InjectCognitoIdentityProvider } from '@nestjs-cognito/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthenticateRequestDto } from './dto/authenticate.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { first } from 'rxjs';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(
    private readonly config: Config,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: config.aws.COGNITO_USER_POOL_ID,
      ClientId: config.aws.COGNITO_CLIENT_ID,
    });
  }

  async register(authRegisterRequest: CreateAuthDto) {
    const { firstName, lastName, email, password } = authRegisterRequest;

    const createdUserPromise = this.userModel.create({
      firstName,
      lastName,
      email,
    });
    const cognitoPromise = new Promise((resolve, reject) => {
      return this.userPool.signUp(
        email,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });

    const [user] = await Promise.all([createdUserPromise, cognitoPromise]);
    return user;
  }

  async authenticate(user: AuthenticateRequestDto) {
    const { email, password } = user;
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    const userData = {
      Username: email,
      Pool: this.userPool,
    };
    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err: { name: string; code: string }) => {
          reject(err);
        },
      });
    });
  }

  verifyEmail(params: VerifyEmailDto) {
    // return `This action verifies email`;
    const user = new CognitoUser({
      Username: params.email,
      Pool: this.userPool,
    });
    return new Promise((resolve, reject) => {
      user.confirmRegistration(params.otp, true, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  findAll() {
    return this.userModel.find().populate('familyId');
  }

  findOne(id: number) {
    return this.userModel.findById(id);
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
