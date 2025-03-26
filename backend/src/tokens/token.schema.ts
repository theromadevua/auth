import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

export type UserDocument = Token & Document;

@Schema()
export class Token {
    @Prop()
    token: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId | string; 
}

export const TokenSchema = SchemaFactory.createForClass(Token);