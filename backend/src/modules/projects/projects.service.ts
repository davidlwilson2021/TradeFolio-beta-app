import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from './entities/project.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Skill } from '../skills/entities/skill.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(Skill) private skillRepo: Repository<Skill>,
  ) {}

  async create(userId: string, input: CreateProjectInput): Promise<Project> {
    const profile = await this.profileRepo.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    const project = new Project();
    project.profileId = profile.profileId;
    project.title = input.title;
    project.description = input.description || '';
    project.locationCity = input.locationCity || '';
    project.locationState = input.locationState || '';
    project.projectDate = input.projectDate ? new Date(input.projectDate) : null as any;
    project.status = 'draft';
    project.sourceType = 'native';

    const saved = await this.projectRepo.save(project);

    if (input.skillIds && input.skillIds.length > 0) {
      const skills = await this.skillRepo.find({
        where: { skillId: In(input.skillIds) },
      });
      saved.skills = skills;
      await this.projectRepo.save(saved);
    }

    return this.getById(saved.projectId);
  }

  async getById(projectId: string): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { projectId },
      relations: ['media', 'skills', 'profile'],
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async getByUser(userId: string, limit = 20, offset = 0): Promise<Project[]> {
    const profile = await this.profileRepo.findOne({ where: { userId } });
    if (!profile) return [];

    return this.projectRepo.find({
      where: { profileId: profile.profileId },
      relations: ['media', 'skills'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async update(userId: string, projectId: string, input: UpdateProjectInput): Promise<Project> {
    const project = await this.getById(projectId);
    await this.verifyOwnership(userId, project);

    if (input.title !== undefined) project.title = input.title;
    if (input.description !== undefined) project.description = input.description;
    if (input.locationCity !== undefined) project.locationCity = input.locationCity;
    if (input.locationState !== undefined) project.locationState = input.locationState;
    if (input.projectDate !== undefined) project.projectDate = new Date(input.projectDate);

    return this.projectRepo.save(project);
  }

  async delete(userId: string, projectId: string): Promise<boolean> {
    const project = await this.getById(projectId);
    await this.verifyOwnership(userId, project);
    await this.projectRepo.remove(project);
    return true;
  }

  async publish(userId: string, projectId: string): Promise<Project> {
    const project = await this.getById(projectId);
    await this.verifyOwnership(userId, project);
    project.status = 'published';
    project.publishedAt = new Date();
    return this.projectRepo.save(project);
  }

  private async verifyOwnership(userId: string, project: Project) {
    const profile = await this.profileRepo.findOne({ where: { userId } });
    if (!profile || project.profileId !== profile.profileId) {
      throw new ForbiddenException('Not your project');
    }
  }
}
