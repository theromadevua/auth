import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/user.service';
import {JwtModule} from "@nestjs/jwt";
import { Token, TokenSchema } from '../tokens/token.schema';
import { SendMailService } from 'src/mail/mail.service';
import { TokenService } from 'src/tokens/token.service';
import { AuthMiddleware } from 'src/middlerwares/auth.middleware';

@Module({
    controllers: [AuthController],
    providers: [AuthService, UsersService, SendMailService, TokenService],
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Token.name, schema: TokenSchema }]),
        JwtModule.register({
            secret: 'SECRET',
            signOptions: {
              expiresIn: '24h'
            }
        })
    ],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthMiddleware).forRoutes(
        { path: 'auth/refresh', method: RequestMethod.ALL },
      );
    }
  }