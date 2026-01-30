import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid', { name: 'profile_id' })
  profileId: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column({ name: 'full_name', length: 100 })
  fullName: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl: string;

  @Column({ name: 'trade_category', length: 50, nullable: true })
  tradeCategory: string;

  @Column({ length: 100, nullable: true })
  specialty: string;

  @Column({ name: 'years_experience', type: 'int', default: 0 })
  yearsExperience: number;

  @Column({ name: 'location_city', length: 100, nullable: true })
  locationCity: string;

  @Column({ name: 'location_state', length: 50, nullable: true })
  locationState: string;

  @Column({ name: 'subscription_tier', length: 20, default: 'free' })
  subscriptionTier: string;

  @Column({ name: 'profile_completion', type: 'int', default: 0 })
  profileCompletion: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Project, (project) => project.profile)
  projects: Project[];
}
