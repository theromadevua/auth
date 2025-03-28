import { Injectable, HttpException, HttpStatus, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { Token } from 'src/tokens/token.schema';
import { User } from 'src/users/user.schema';
import { TokenService } from 'src/tokens/token.service';
import { SendMailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly mailService: SendMailService,
        private readonly tokenService: TokenService,
        private readonly configService: ConfigService,
        @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    async login(dto: CreateUserDto): Promise<AuthResponse> {
        try {
            const user: UserDocument = await this.tokenService.validateUser(dto);
            const accessToken: TokenResponse = await this.tokenService.generateAccessToken(user);
            const refreshToken: TokenResponse = await this.tokenService.generateRefreshToken(user);

            await this.tokenService.saveToken({ refreshToken: refreshToken.token, userId: user._id });

            return { refreshToken: refreshToken.token, accessToken: accessToken.token };
        } catch (error) {
            throw new HttpException(error.message || 'Login failed', HttpStatus.BAD_REQUEST);
        }
    }

    async registration(dto: CreateUserDto): Promise<AuthResponse> {
        try {
            const candidate: UserDocument | null = await this.userService.getUserByEmail(dto.email);
            if (candidate) {
                throw new HttpException('User with this email already exists', HttpStatus.BAD_REQUEST);
            }

            const hashPassword: string = await bcrypt.hash(dto.password, 5);
            const user: UserDocument = await this.userService.createUser({ ...dto, password: hashPassword });

            const accessToken: TokenResponse = await this.tokenService.generateAccessToken(user);
            const refreshToken: TokenResponse = await this.tokenService.generateRefreshToken(user);

            await this.tokenService.saveToken({ refreshToken: refreshToken.token, userId: user._id });

            return { accessToken: accessToken.token, refreshToken: refreshToken.token };
        } catch (error) {
            throw new HttpException(error.message || 'Registration failed', HttpStatus.BAD_REQUEST);
        }
    }

    async refresh(refreshToken: string): Promise<AuthResponse> {
        try {
            if (!refreshToken) {
                throw new HttpException('Refresh token is required', HttpStatus.BAD_REQUEST);
            }

            const tokenInDb = await this.tokenModel.findOne({ token: refreshToken });
            if (!tokenInDb) {
                throw new UnauthorizedException('User is not authorized');
            }

            const tokenData = this.jwtService.verify(refreshToken, {secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')});
            const user: UserDocument | null = await this.userModel.findOne({ email: tokenData.email });
            
            if (!user) {
                throw new HttpException('User with this email does not exist', HttpStatus.BAD_REQUEST);
            }

            const newAccessToken: TokenResponse = await this.tokenService.generateAccessToken(user);
            const newRefreshToken: TokenResponse = await this.tokenService.generateRefreshToken(user);

            await this.tokenService.saveToken({ refreshToken: newRefreshToken.token, userId: user._id });

            return { refreshToken: newRefreshToken.token, accessToken: newAccessToken.token };
        } catch (error) {
            throw new HttpException(error.message || 'Token refresh failed', HttpStatus.BAD_REQUEST);
        }
    }

    async logout(refreshToken: string): Promise<void> {
        try {
            const tokenInDb = await this.tokenModel.findOne({ token: refreshToken });
            if (!tokenInDb) {
                throw new UnauthorizedException('User is not authorized');
            }
            await this.tokenModel.deleteOne({ token: refreshToken });
        } catch (error) {
            throw new HttpException(error.message || 'Logout failed', HttpStatus.BAD_REQUEST);
        }
    }

    async resetPasswordRequest(email: string): Promise<void> {
        try {
            const user: UserDocument | null = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new HttpException('User with this email does not exist', HttpStatus.BAD_REQUEST);
            }
            
            await this.mailService.sendPassRecoverMail(email)
        } catch (error) {
            throw new HttpException(error.message || 'Password reset failed', HttpStatus.BAD_REQUEST);
        }
    }

    async resetPassword(token: string, password: string): Promise<void> {
        const email = await this.mailService.decodeConfirmationToken(token);
    
        const user: UserDocument | null = await this.userModel.findOne({email});
        
        if (!user) {
            throw new NotFoundException(`No user found for email: ${email}`);
        }
    
        const hashPassword: string = await bcrypt.hash(password, 5);
        user.password = hashPassword;
        
        delete user.passwordRecover; 
        user.save()
    }
}