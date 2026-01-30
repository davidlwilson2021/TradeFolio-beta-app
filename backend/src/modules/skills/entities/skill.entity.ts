import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import { TradeCategoryEntity } from './trade-category.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid', { name: 'skill_id' })
  skillId: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  aliases: string[];

  @ManyToOne(() => TradeCategoryEntity, (cat) => cat.skills)
  @JoinColumn({ name: 'category_id' })
  category: TradeCategoryEntity;
}
