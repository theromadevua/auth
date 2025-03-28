import { Injectable } from "@nestjs/common";
import { User } from "./user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async createUser(dto: CreateUserDto): Promise<UserDocument> {
        const user = await this.userModel.create(dto);
        return user;
    }

    async getUserByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }
}
