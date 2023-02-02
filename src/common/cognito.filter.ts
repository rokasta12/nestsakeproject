import { UserNotConfirmedException } from '@aws-sdk/client-cognito-identity-provider';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: any, host: ArgumentsHost): void {
    console.log(
      '🚀 ~ file: cognito.filter.ts:17 ~ AllExceptionsFilter ~ exception',
      JSON.stringify(exception),
    );
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const isNameExists = Boolean(exception?.name)

    const cognitoErrors = [
      'UserNotConfirmedException',
      'NotAuthorizedException',
    ];

    const getCognitoError = (errorName) => {
      if (cognitoErrors.includes(errorName)) {
        return errorName;
      } else {
        return 'Internal Server Error';
      }
    };

    const ctx = host.switchToHttp();
    // {"name":"UserNotConfirmedException","code":"UserNotConfirmedException"}
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: isNameExists
        ? getCognitoError(exception.name)
        : 'Internal Server Error',
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
