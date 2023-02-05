import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request & { user: any },
  ) {
    if (!req?.user?.familyId || (req?.user?.familyId).length == 0)
      throw new HttpException('User doesnt have family', HttpStatus.NOT_FOUND);
    return this.postsService.create({
      ...createPostDto,
      userId: req.user._id,
      familyId: req?.user?.familyId,
      text: '',
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.postsService.delete(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comments')
  createComment(
    @Param('id') postId: string,
    @Body() newComment: { text: string },
    @Req() req: Request & { user: any },
  ) {
    return this.postsService.createComment(postId, {
      ...newComment,
      userId: req.user._id,
    });
  }

  @Delete(':id/comments/:commentId')
  deleteComment(@Param('commentId') commentId: string) {
    return this.postsService.deleteComment(commentId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @Get('posts')
  findAllPosts() {
    return this.postsService.findAll();
  }
}
