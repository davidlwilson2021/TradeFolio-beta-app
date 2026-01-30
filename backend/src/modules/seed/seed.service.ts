import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TradeCategoryEntity } from '../skills/entities/trade-category.entity';
import { Skill } from '../skills/entities/skill.entity';

const CATEGORIES = [
  { name: 'Electrical', slug: 'electrical', displayOrder: 1 },
  { name: 'HVAC', slug: 'hvac', displayOrder: 2 },
  { name: 'Plumbing', slug: 'plumbing', displayOrder: 3 },
  { name: 'Welding', slug: 'welding', displayOrder: 4 },
  { name: 'Carpentry', slug: 'carpentry', displayOrder: 5 },
  { name: 'Masonry', slug: 'masonry', displayOrder: 6 },
  { name: 'Roofing', slug: 'roofing', displayOrder: 7 },
  { name: 'Painting', slug: 'painting', displayOrder: 8 },
];

const ELECTRICAL_SKILLS = [
  { name: 'Rough-in', slug: 'rough-in', aliases: ['rough in', 'roughing'] },
  { name: 'Conduit Bending', slug: 'conduit-bending', aliases: ['pipe bending', 'emt bending'] },
  { name: 'Panel Termination', slug: 'panel-termination', aliases: ['panel work', 'breaker panel'] },
  { name: 'Low Voltage', slug: 'low-voltage', aliases: ['LV', 'data', 'network cabling'] },
];

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(TradeCategoryEntity) private catRepo: Repository<TradeCategoryEntity>,
    @InjectRepository(Skill) private skillRepo: Repository<Skill>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const count = await this.catRepo.count();
    if (count > 0) {
      this.logger.log('Seed data already exists, skipping');
      return;
    }

    this.logger.log('Seeding trade categories and skills...');

    for (const cat of CATEGORIES) {
      const category = this.catRepo.create(cat);
      await this.catRepo.save(category);

      if (cat.slug === 'electrical') {
        for (const skill of ELECTRICAL_SKILLS) {
          const s = this.skillRepo.create({
            ...skill,
            categoryId: category.categoryId,
          });
          await this.skillRepo.save(s);
        }
      }
    }

    this.logger.log('Seed complete: 8 categories, 4 electrical skills');
  }
}
