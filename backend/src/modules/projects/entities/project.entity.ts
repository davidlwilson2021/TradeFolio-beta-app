import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { ProjectMedia } from './project-media.entity';
import { Skill } from '../../skills/entities/skill.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid', { name: 'project_id' })
  projectId: string;

  @Column({ name: 'profile_id' })
  profileId: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'source_type', length: 10, default: 'native' })
  sourceType: string;

  @Column({ length: 20, default: 'draft' })
  status: string;

  @Column({ name: 'location_city', length: 100, nullable: true })
  locationCity: string;

  @Column({ name: 'location_state', length: 50, nullable: true })
  locationState: string;

  @Column({ name: 'project_date', type: 'date', nullable: true })
  projectDate: Date;

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @Column({ name: 'like_count', type: 'int', default: 0 })
  likeCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt: Date;

  @ManyToOne(() => Profile, (profile) => profile.projects)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @OneToMany(() => ProjectMedia, (media) => media.project)
  media: ProjectMedia[];

  @ManyToMany(() => Skill)
  @JoinTable({
    name: 'project_skills',
    joinColumn: { name: 'project_id', referencedColumnName: 'projectId' },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'skillId' },
  })
  skills: Skill[];
}
