import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true, type: String })
  description: string;

  @Prop({
    required: true,
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  })
  @Type(() => User)
  user: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
