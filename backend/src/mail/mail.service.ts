import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SendMailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async sendPassRecoverMail(email: string): Promise<boolean> {
      try {

        const token = this.jwtService.sign({email}, {
          secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
          expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`
        });

        const link = `${this.configService.get<string>('CLIENT_URL')}/reset-password/${token}`;
      
        await this.userModel.findOne({email}).then(async (user) => {
          if (!user) {
            throw new BadRequestException('User not found');
          }

          user.passwordRecover = token;
          await user.save();
        });
    
        const mailHTML = `
          <html>
            <head>
              <title>Letter</title>
            </head>
            <body>
              <h1>Hi, ${email}, did you request password changing?</h1>
              <p>If it was you, click on the link below:</p>
              <a href="${link}">${link}</a>
            </body>
          </html>
        `;
        console.log(link)
        this
          .mailerService
          .sendMail({
            to: 'epfk.121.21filonenko@gmail.com',
            from: `<${this.configService.get<string>('EMAIL_USERNAME') ?? ''}>`, 
            subject: 'password recovery', 
            html: mailHTML
          })
          .catch((err) => {
            console.log(err)
          });
          
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async decodeConfirmationToken(token: string) {
    try {
        const payload = await this.jwtService.verify(token, {
            secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET')
        });

        if (typeof payload === 'object' && 'email' in payload) {
            return payload.email;
        }

        throw new BadRequestException();
    } catch (error) {
        if (error?.name === 'TokenExpiredError') {
            throw new BadRequestException(
                'Email confirmation token expired'
            );
        }
        throw new BadRequestException('Bad confirmation token');
    }
}

}