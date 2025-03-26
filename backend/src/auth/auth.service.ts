import { Injectable, HttpException,HttpStatus, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/user.service';
import * as bcrypt from 'bcryptjs'
import {JwtService} from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from 'src/tokens/token.schema';
import { User } from 'src/users/user.schema';

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        @InjectModel(Token.name) private tokenModel: Model<Token>,
        @InjectModel(User.name) private userModel: Model<User>
    ){}

    async login(data: any) {
        const user = await this.validateUser(data)
        const accessToken = await this.generateAccesToken(user)
        const refreshToken =  await this.generateRefreshToken(user)

        const savedToken = await this.saveToken({refreshToken: refreshToken.token, userId: user._id})
        if(!savedToken){
            throw new HttpException('Токен не сохранен', HttpStatus.BAD_REQUEST)
        }
        
        return {refreshToken: refreshToken.token, accessToken: accessToken.token}
    }

    async registration(data){
        const candidate = await this.userService.getUserByEmail(data.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }
        
        const hashPassword = await bcrypt.hash(data.password, 5);
        const user = await this.userService.createUser({...data, password: hashPassword})

        const accessToken = await this.generateAccesToken(user)
        const refreshToken =  await this.generateRefreshToken(user)

        const savedToken = await this.saveToken({refreshToken: refreshToken.token, userId: user._id})
        if(!savedToken){
            throw new HttpException('Токен не сохранен', HttpStatus.BAD_REQUEST)
        }

        return {accessToken: accessToken.token, refreshToken: refreshToken.token}
    }

    async refresh(refreshToken: string){
       
        if(!refreshToken){
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }

        const tokenInDb = await this.tokenModel.findOne({token: refreshToken})
        if(!tokenInDb){
            throw new HttpException('Пользователь не авторизован', HttpStatus.BAD_REQUEST)
        }
      
        const tokenData = await this.jwtService.verify(refreshToken);
        const user = await this.userModel.findOne({email: tokenData.email})
        if(!user){
            throw new HttpException('Пользователь с таким email не существует', HttpStatus.BAD_REQUEST)
        }
        
        const newAccessToken = await this.generateAccesToken(user)
        const newRefreshToken =  await this.generateRefreshToken(user)


        const savedToken = await this.saveToken({refreshToken: newRefreshToken.token, userId: user.id})
        if(!savedToken){
            throw new HttpException('Токен не сохранен', HttpStatus.BAD_REQUEST)
        }
       

        return {refreshToken: newRefreshToken.token, accessToken: newAccessToken.token}
    }

    async logout(refreshToken: string){
        const tokenInDb = await this.tokenModel.findOne({token: refreshToken})
        if(!tokenInDb){
            throw new HttpException('Пользователь не авторизован', HttpStatus.BAD_REQUEST)
        }
        await this.tokenModel.deleteOne({token: refreshToken})
    }

    private async saveToken({refreshToken, userId}){
        const existToken = await this.tokenModel.findOne({user: userId})
        if(existToken){
            existToken.token = refreshToken;
            await existToken.save()
            return existToken
        }
        return await this.tokenModel.create({token: refreshToken, user: userId})
    }

    private async generateAccesToken(user: any) {
        const payload = {email: user.email, id: user._id}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async generateRefreshToken(user: any) {
        const payload = {email: user.email, id: user._id, expiresIn: '7d'}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(data: any) {
        const user: any = await this.userService.getUserByEmail(data.email);
        const passwordEquals = await bcrypt.compare(data.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
    }

}