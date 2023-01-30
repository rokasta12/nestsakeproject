import { CognitoModule } from '@nestjs-cognito/core';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config';
import { DBConfig } from './config/config.schema';
import { PostsModule } from './posts/posts.module';
import { FamiliesModule } from './families/families.module';

@Module({
  imports: [
    ConfigModule,
    CognitoModule.register({
      region: 'us-east-1',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: DBConfig) => ({
        uri: config.URI,
        useNewUrlParser: true,
      }),
      inject: [DBConfig],
    }),
    AuthModule,
    PostsModule,
    FamiliesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
