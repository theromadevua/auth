import { Body, Controller, Post, Get, Req, Res, UseGuards, Delete, Put, HttpException, HttpStatus, Patch, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

interface ResetPasswordDto {
    token: string;
    password: string;
}


export class UserDto {
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    password: string;
    
    @IsEmail()
    email: string;

    @IsString()
    _id?: string;
}

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Post('/registration')
    async registration(@Body() data: UserDto, @Res() res: Response): Promise<Response> {
        try {
            const userData = await this.authService.registration(data);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (error) {
            console.error(error);
            throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
        }
    }

    @Post('/login')
    async login(@Body() data: UserDto, @Res() res: Response): Promise<Response> {
        try {
            const userData: any = await this.authService.login(data);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (error) {
            console.error(error);
            throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
        }
    }

    @Get('/refresh')
    async refresh(@Req() req: Request & {user: UserDto}, @Res() res: Response): Promise<Response> {
        try {
            const tokens = await this.authService.refresh(req.cookies.refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(tokens.accessToken);
        } catch (error) {
            console.error(error);
            throw new HttpException('Token refresh failed', HttpStatus.UNAUTHORIZED);
        }
    }

    @Delete('/logout')
    async logout(@Req() req: Request, @Res() res: Response): Promise<Response> {
        try {
            const { refreshToken } = req.cookies;
            await this.authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error(error);
            throw new HttpException('Logout failed', HttpStatus.BAD_REQUEST);
        }
    }

    @Get('/reset-password-request')
    async resetPasswordRequest(@Query('email') email: string,  @Res() res: Response): Promise<Response> {
        try {
            await this.authService.resetPasswordRequest(email);
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            throw new HttpException('Password reset failed', HttpStatus.BAD_REQUEST);
        }
    }

    @Patch('/reset-password')
    async resetPassword(@Body() data: ResetPasswordDto, @Res() res: Response): Promise<Response> {
        try {
            await this.authService.resetPassword(data.token, data.password);
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            throw new HttpException('Password reset failed', HttpStatus.BAD_REQUEST);
        }
    }
}