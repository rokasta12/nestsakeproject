import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { Config } from 'src/config/config.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthenticateRequestDto } from './dto/authenticate.dto';
import { CreateAuthDto } from './dto/create-auth.dto';

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
          console.log('onSuccess: ', result);
          resolve(result);
        },
        onFailure: (err) => {
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

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }

  async getUserFamilies(id: string) {
    const user = await this.userModel.findById(id).populate('familyId');
    console.log(user);
    return user;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  async updateDetails(req: any) {
    const test = await this.userModel.findByIdAndUpdate(req.body._id, req.body);
    console.log(test);
    return test;
  }

  async findUserById(id: string) {
    const user = await (await this.userModel.findById(id)).populate('familyId');
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else {
      return user;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
