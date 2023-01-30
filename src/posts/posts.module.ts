import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './entities/post.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './entities/comment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
