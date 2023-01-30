import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { Family } from 'src/families/entities/family.entity';
import { Comment } from './comment.entity';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, type: String })
  audioUrl: string;

  @Prop({
    required: true,
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  })
  @Type(() => User)
  postedBy: User;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  })
  @Type(() => Comment)
  comments: Comment[];

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
  })
  @Type(() => Family)
  familyId: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
