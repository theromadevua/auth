import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/user.schema';
import { Token, TokenSchema } from './token.schema';

@Module({
    providers: [TokenService, JwtService, UsersService],
    exports: [TokenService],
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Token.name, schema: TokenSchema }]),
    ],
})

export class TokenModule {}