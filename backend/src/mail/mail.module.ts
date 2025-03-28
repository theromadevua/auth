import { Module } from '@nestjs/common';
import { SendMailService } from './mail.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/user.schema';

@Module({
    providers: [SendMailService, JwtService, ConfigService],
    imports: [
            MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    exports: [SendMailService]
})
export class MailModule {}