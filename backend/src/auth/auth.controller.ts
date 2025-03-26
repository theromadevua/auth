import { Body, Controller, Post, Get, Req, Res, UseGuards, Delete} from '@nestjs/common';
import { AuthService } from './auth.service';
import {Request, Response} from 'express'

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Post('/registration')
    async registration(@Body() data, @Res() res: Response) {
        const userData = await this.authService.registration(data)
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(userData)
    }

    @Post('/login')
    async login(@Body() data, @Res() res: Response) {
        console.log('ds')
        const userData:any = await this.authService.login(data)
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
     
        return res.json(userData)
    }

    @Get('/refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        console.log(req.cookies)
        const tokens = await this.authService.refresh(req.cookies.refreshToken)
        res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(tokens.accessToken)
    }
    
    @Delete('/logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        const { refreshToken } = req.cookies;
        await this.authService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: 'Logged out successfully' });
    }
}