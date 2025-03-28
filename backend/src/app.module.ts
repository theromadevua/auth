import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User, UserSchema } from './users/user.schema';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';  
import { TokenModule } from './tokens/token.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthMiddleware } from './middlerwares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forRoot('mongodb+srv://theromadevua:pass12345word@filmgo.cbmh6q6.mongodb.net/auth', {}),
    UsersModule,
    AuthModule,
    MailModule,
    TokenModule,
    JwtModule.register({}),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: "smtp.gmail.com",
          port: 587,
          secure: false, 
          auth: {
            user: configService.get<string>('EMAIL_USERNAME'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '',
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  
}
