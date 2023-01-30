import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';

export type FamilyDocument = Family & Document;

@Schema({ timestamps: true })
export class Family {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Type(() => User)
  admin: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
  @Type(() => Post)
  posts: Post[];

  @Prop({ type: [String] })
  members: string[];
}

export const FamilySchema = SchemaFactory.createForClass(Family);
