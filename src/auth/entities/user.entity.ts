import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Family } from 'src/families/entities/family.entity';
import { Type } from 'class-transformer';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {

  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ unique: true, type: String })
  email: string;

  @Prop({ type: String })
  profilePicUrl: string;

  @Prop({ type: String })
  birthday: string;

  @Prop({ type: Number })
  phoneNumber: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Family.name }] })
  @Type(() => Family)
  familyId: Family[];
  
}

export const UserSchema = SchemaFactory.createForClass(User);
