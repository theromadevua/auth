import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Token } from "./token.schema";
import { User } from "src/users/user.schema";
import { HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/user.service";
import * as bcrypt from 'bcryptjs';
import { ConfigService } from "@nestjs/config";

export class TokenService {
    
    constructor(        
        private readonly jwtService: JwtService,
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
        @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {}

    async saveToken({ refreshToken, userId }: { refreshToken: string; userId: string }): Promise<Token> {
        try {
            const existingToken = await this.tokenModel.findOne({ user: userId });
            if (existingToken) {
                existingToken.token = refreshToken;
                await existingToken.save();
                return existingToken;
            }
            return await this.tokenModel.create({ token: refreshToken, user: userId });
        } catch (error) {
            throw new HttpException('Failed to save token', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async generateAccessToken(user: UserDocument): Promise<TokenResponse> {
        const payload = { email: user.email, id: user._id };
        const secret = this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
        return { token: this.jwtService.sign(payload, { secret, expiresIn: '30m' }) };
    }

    async generateRefreshToken(user: UserDocument): Promise<TokenResponse> {
        const payload = { email: user.email, id: user._id };
        const secret = this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
        return { token: this.jwtService.sign(payload, { secret, expiresIn: '7d' }) };
    }

    async validateUser(dto: CreateUserDto): Promise<UserDocument> {
        const user: UserDocument | null = await this.userService.getUserByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const passwordMatches = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatches) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return user;
    }
}
