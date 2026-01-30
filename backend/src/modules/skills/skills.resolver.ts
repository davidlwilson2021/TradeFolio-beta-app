import { Resolver, Query, Args } from '@nestjs/graphql';
import { SkillsService } from './skills.service';
import { TradeCategoryModel } from './models/trade-category.model';
import { SkillModel } from './models/skill.model';

@Resolver()
export class SkillsResolver {
  constructor(private skillsService: SkillsService) {}

  @Query(() => [TradeCategoryModel])
  async getTradeCategories(): Promise<any[]> {
    return this.skillsService.getCategories();
  }

  @Query(() => [SkillModel])
  async getSkillsByCategory(
    @Args('category') category: string,
  ): Promise<any[]> {
    return this.skillsService.getSkillsByCategory(category);
  }
}
