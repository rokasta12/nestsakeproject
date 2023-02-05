import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Family } from './entities/family.entity';
import mongoose from 'mongoose';
import { uuid } from 'uuidv4';

@Injectable()
export class FamiliesService {
  @InjectModel(Family.name)
  private readonly familyModel: Model<Family>;

  create(createFamilyDto: CreateFamilyDto & { adminUser: string }) {
    const code = uuid();
    return this.familyModel.create({ ...createFamilyDto, code: code });
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
  async getMyFamilies(userId: string) {
    const families = await this.familyModel
      .find({
        members: {
          $in: [userId],
        },
      })
      .select('+code');

    return families;
  }

  async joinFamily(userId: string, code: string) {
    const family = await this.familyModel.findOne({ code });
    if (!family) {
      throw new HttpException('Family not found', HttpStatus.NOT_FOUND);
    } else {
      if (!family?.isAvailibleForNewMembers) {
        throw new HttpException(
          'Family is not availible for new members',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (family.members.includes(userId))
        throw new HttpException(
          'User is already a member of this family',
          HttpStatus.BAD_REQUEST,
        );
      family.members.push(userId);
      await family.save();
      return family;
    }
  }

  findAll() {
    return this.familyModel.find().populate('members');
  }

  async findOne(id: any) {
    const family = await this.familyModel.findById(id);
    return family;
  }

  update(id: number, updateFamilyDto: UpdateFamilyDto) {
    return `This action updates a #${id} family`;
  }

  remove(id: number) {
    return `This action removes a #${id} family`;
  }
}
