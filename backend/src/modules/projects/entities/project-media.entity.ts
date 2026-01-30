import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('project_media')
export class ProjectMedia {
  @PrimaryGeneratedColumn('uuid', { name: 'media_id' })
  mediaId: string;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column({ name: 'media_type', length: 10 })
  mediaType: string;

  @Column({ name: 'original_url', type: 'text' })
  originalUrl: string;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl: string;

  @Column({ name: 'blur_hash', length: 100, nullable: true })
  blurHash: string;

  @Column({ name: 'is_before_after', type: 'boolean', default: false })
  isBeforeAfter: boolean;

  @Column({ name: 'before_after_type', length: 10, nullable: true })
  beforeAfterType: string;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Project, (project) => project.media)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
