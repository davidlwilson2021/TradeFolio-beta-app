import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsService } from './skills.service';
import { SkillsResolver } from './skills.resolver';
import { TradeCategoryEntity } from './entities/trade-category.entity';
import { Skill } from './entities/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TradeCategoryEntity, Skill])],
  providers: [SkillsService, SkillsResolver],
  exports: [SkillsService],
})
export class SkillsModule {}
