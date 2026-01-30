import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { TradeCategoryEntity } from '../skills/entities/trade-category.entity';
import { Skill } from '../skills/entities/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TradeCategoryEntity, Skill])],
  providers: [SeedService],
})
export class SeedModule {}
