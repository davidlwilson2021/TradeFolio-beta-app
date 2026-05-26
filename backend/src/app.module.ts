import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { SkillsModule } from './modules/skills/skills.module';
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Repo root when running from dist; backend/ when developers copy .env beside package.json.
      envFilePath: [
        join(__dirname, '..', '..', '.env'),
        join(__dirname, '..', '.env'),
      ],
    }),
    // Rate-limit all requests: 20 per 60 s globally.
    // Auth mutations apply an additional tighter guard via GqlThrottlerGuard.
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 20 }]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      // Gate playground to non-production environments only.
      // In production, the playground exposes the full schema to unauthenticated users.
      playground: process.env.NODE_ENV !== 'production',
      context: ({ req }: any) => ({ req }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 5432),
        username: config.get('DATABASE_USERNAME', 'postgres'),
        password: config.get('DATABASE_PASSWORD', 'postgres'),
        database: config.get('DATABASE_NAME', 'tradefolio_dev'),
        autoLoadEntities: true,
        // Never run synchronize in production — it can silently drop columns.
        // Use migrations for prod schema changes.
        synchronize: process.env.NODE_ENV !== 'production',
      }),
    }),
    AuthModule,
    ProfilesModule,
    ProjectsModule,
    SkillsModule,
    SeedModule,
  ],
})
export class AppModule {}
