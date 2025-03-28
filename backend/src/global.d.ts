import { Max, MinLength } from "class-validator";
import { ObjectId } from "mongoose";
import { User } from "./user.schema";

declare global {

    type UserDocument = User & Document;

    interface UserType {
        _id?: string,
        email: string,
        password: string,
        createdAt?: string,
        updatedAt?: string
        passwordRecover?: string,
    }

    type TokenResponse = { token: string };

    type AuthResponse = { accessToken: string; refreshToken: string };

    export class CreateUserDto {
        @IsString()
        @MinLength(5)
        @MaxLength(20)
        password: string;
      
        @IsEmail()
        email: string;
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

        @IsString()
        passwordRecover?: string;
    }
}
  
export {};