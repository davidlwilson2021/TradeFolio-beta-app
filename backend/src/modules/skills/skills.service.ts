import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TradeCategoryEntity } from './entities/trade-category.entity';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(TradeCategoryEntity) private catRepo: Repository<TradeCategoryEntity>,
    @InjectRepository(Skill) private skillRepo: Repository<Skill>,
  ) {}

  async getCategories(): Promise<TradeCategoryEntity[]> {
    return this.catRepo.find({
      order: { displayOrder: 'ASC' },
      relations: ['skills'],
    });
  }

  async getSkillsByCategory(categorySlug: string): Promise<Skill[]> {
    const category = await this.catRepo.findOne({ where: { slug: categorySlug } });
    if (!category) return [];
    return this.skillRepo.find({ where: { categoryId: category.categoryId } });
  }
}
