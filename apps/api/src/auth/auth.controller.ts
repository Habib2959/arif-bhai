import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { auth } from './auth.config';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  @ApiOperation({
    summary: 'Handle all authentication routes (login, register, logout, etc.)',
  })
  @All('*')
  async handleAuth(@Req() request: Request, @Res() response: Response) {
    // Convert Express request to Web API Request format for better-auth
    const url = new URL(
      `${request.protocol}://${request.get('host')}${request.originalUrl}`,
    );
    const webRequest = new globalThis.Request(url, {
      method: request.method,
      headers: request.headers as any,
      body:
        request.method !== 'GET' && request.method !== 'HEAD'
          ? JSON.stringify(request.body)
          : undefined,
    });

    const authResponse = await auth.handler(webRequest);

    // Convert Web API Response to Express response
    response.status(authResponse.status);

    authResponse.headers.forEach((value, key) => {
      response.setHeader(key, value);
    });

    const responseBody = await authResponse.text();
    return response.send(responseBody);
  }
}
