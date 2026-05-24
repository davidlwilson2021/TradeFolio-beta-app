import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectModel } from './models/project.model';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Resolver(() => ProjectModel)
export class ProjectsResolver {
  constructor(private projectsService: ProjectsService) {}

  @Query(() => ProjectModel)
  async getProject(
    @Args('projectId', { type: () => ID }) projectId: string,
  ): Promise<any> {
    return this.projectsService.getById(projectId);
  }

  // T-9: Unauthenticated public view — only published projects are returned.
  // Draft and archived projects are hidden from unauthenticated callers.
  // Authenticated users can see their own full project list via myProjects.
  @Query(() => [ProjectModel])
  async getProjectsByUser(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 }) offset: number,
  ): Promise<any[]> {
    return this.projectsService.getPublishedByUser(userId, limit, offset);
  }

  @Query(() => [ProjectModel])
  @UseGuards(GqlAuthGuard)
  async myProjects(
    @CurrentUser() user: any,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 }) limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 }) offset: number,
  ): Promise<any[]> {
    return this.projectsService.getByUser(user.sub, limit, offset);
  }

  @Mutation(() => ProjectModel)
  @UseGuards(GqlAuthGuard)
  async createProject(
    @CurrentUser() user: any,
    @Args('input') input: CreateProjectInput,
  ): Promise<any> {
    return this.projectsService.create(user.sub, input);
  }

  @Mutation(() => ProjectModel)
  @UseGuards(GqlAuthGuard)
  async updateProject(
    @CurrentUser() user: any,
    @Args('projectId', { type: () => ID }) projectId: string,
    @Args('input') input: UpdateProjectInput,
  ): Promise<any> {
    return this.projectsService.update(user.sub, projectId, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteProject(
    @CurrentUser() user: any,
    @Args('projectId', { type: () => ID }) projectId: string,
  ): Promise<boolean> {
    return this.projectsService.delete(user.sub, projectId);
  }

  @Mutation(() => ProjectModel)
  @UseGuards(GqlAuthGuard)
  async publishProject(
    @CurrentUser() user: any,
    @Args('projectId', { type: () => ID }) projectId: string,
  ): Promise<any> {
    return this.projectsService.publish(user.sub, projectId);
  }
}
