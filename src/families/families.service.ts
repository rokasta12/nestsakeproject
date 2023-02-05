import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Family } from './entities/family.entity';
import mongoose from 'mongoose';

@Injectable()
export class FamiliesService {
  @InjectModel(Family.name)
  private readonly familyModel: Model<Family>;

  create(createFamilyDto: CreateFamilyDto & { admin: string }) {
    return this.familyModel.create(createFamilyDto);
  }

  addMember(
    addMemberDto: { userId: string; familyId: string },
    adminId: string,
  ) {
    return this.familyModel.findOneAndUpdate(
      { _id: addMemberDto.familyId, admin: adminId },
      { $push: { members: addMemberDto.userId } },
      { new: true },
    );
  }

  removeMember(removeMemberDto: { userId: string }, adminId: string) {
    // return this.familyModel.findOneAndUpdate(
    //   { admin: adminId },
    //   { $pull: { members: removeMemberDto.userId } },
    //   { new: true },
    // );
  }

  findAll() {
    return this.familyModel.find().populate('members');
  }

  async findOne(id: any) {
    const family = await this.familyModel.findById(id);
    console.log(family);
    return family;
  }

  update(id: number, updateFamilyDto: UpdateFamilyDto) {
    return `This action updates a #${id} family`;
  }

  remove(id: number) {
    return `This action removes a #${id} family`;
  }
}
