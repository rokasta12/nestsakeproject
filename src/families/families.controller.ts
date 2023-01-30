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
} from '@nestjs/common';
import { FamiliesService } from './families.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createFamilyDto: CreateFamilyDto,
    @Req() req: Request & { user: any },
  ) {
    return this.familiesService.create({
      ...createFamilyDto,
      admin: req.user._id,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  addMember(
    @Body() addMemberDto: { userId: string; familyId: string },
    @Req() req: Request & { user: any },
  ) {
    return this.familiesService.addMember(addMemberDto, req.user._id);
  }

  removeMember(
    @Body() removeMemberDto: { userId: string },
    @Req() req: Request & { user: any
  }) {
    return this.familiesService.removeMember(removeMemberDto, req.user._id);
  }

  @Get()
  findAll() {
    return this.familiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.familiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFamilyDto: UpdateFamilyDto) {
    return this.familiesService.update(+id, updateFamilyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.familiesService.remove(+id);
  }
}
