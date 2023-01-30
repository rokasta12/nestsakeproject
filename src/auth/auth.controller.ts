import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthenticateRequestDto } from './dto/authenticate.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('v1/auth/register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('v1/auth/login')
  async authenticate(@Body() authenticateRequest: AuthenticateRequestDto) {
    return this.authService.authenticate(authenticateRequest);
  }

  @Post('v1/auth/verify-email')
  async verifyEmail(@Body() verifyEmailRequest: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailRequest);
  }

  @Get('v1/auth/me')
  @UseGuards(AuthGuard('jwt'))
  async me(@Req() req: Request & { user: any }) {
    return req.user;
  }

  @Get('users')
  findAll() {
    return this.authService.findAll();
  }

  //BU CALISMIYO
  @Get('user/:id')
  findOne(@Param("id") id: number){
    return this.authService.findOne(+id)
  }


  /*  
  // TODO: add missing cruds Havent used thsese yet
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  } */
}
