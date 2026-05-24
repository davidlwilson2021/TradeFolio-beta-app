import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { RegisterInput } from './dto/register.input';
import { UserModel } from './models/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    private jwtService: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const existing = await this.userRepo.findOne({ where: { email: input.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = this.userRepo.create({ email: input.email, passwordHash });
    await this.userRepo.save(user);

    const profile = this.profileRepo.create({
      userId: user.id,
      fullName: input.fullName,
      email: input.email,
      tradeCategory: input.tradeCategory || undefined,
    });
    await this.profileRepo.save(profile);

    return this.generateTokens(user, profile);
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const profile = await this.profileRepo.findOne({ where: { userId: user.id } });
    if (!profile) {
      throw new UnauthorizedException('User profile not found');
    }
    return this.generateTokens(user, profile);
  }

  /** T-11: Returns a UserModel DTO — never the raw User entity (which contains passwordHash). */
  async getUserById(id: string): Promise<UserModel | null> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) return null;
    const profile = await this.profileRepo.findOne({ where: { userId: id } });
    return {
      id:        user.id,
      email:     user.email,
      fullName:  profile?.fullName ?? '',
      profileId: profile?.profileId,
    };
  }

  private generateTokens(user: User, profile: Profile) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: profile.fullName,
        profileId: profile.profileId,
      },
    };
  }
}
