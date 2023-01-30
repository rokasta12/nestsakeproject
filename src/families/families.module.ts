import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { Family, FamilySchema } from './entities/family.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Family.name, schema: FamilySchema }]),
  ],
  controllers: [FamiliesController],
  providers: [FamiliesService]
})
export class FamiliesModule {}
