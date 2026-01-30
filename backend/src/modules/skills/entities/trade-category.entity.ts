import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import { Skill } from './skill.entity';

@Entity('trade_categories')
export class TradeCategoryEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'category_id' })
  categoryId: string;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 50, unique: true })
  slug: string;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @OneToMany(() => Skill, (skill) => skill.category)
  skills: Skill[];
}
