import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Family } from 'src/families/entities/family.entity';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  

  @Prop({ type: String })
  firstName: string;

  @Prop({type: String })
  lastName: string;

  @Prop({unique: true, type: String })
  email: string;

  @Prop({type: String })
  profilePicUrl: string;

  @Prop({type: String })
  birthday: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Family.name }] })
  familyId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
