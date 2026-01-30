import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { UpdateProfileInput } from './dto/update-profile.input';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
  ) {}

  async getByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileRepo.findOne({
      where: { userId },
      relations: ['projects'],
    });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async getById(profileId: string): Promise<Profile> {
    const profile = await this.profileRepo.findOne({
      where: { profileId },
      relations: ['projects'],
    });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async update(userId: string, input: UpdateProfileInput): Promise<Profile> {
    const profile = await this.getByUserId(userId);

    if (input.fullName !== undefined) profile.fullName = input.fullName;
    if (input.tradeCategory !== undefined) profile.tradeCategory = input.tradeCategory;
    if (input.specialty !== undefined) profile.specialty = input.specialty;
    if (input.yearsExperience !== undefined) profile.yearsExperience = input.yearsExperience;
    if (input.locationCity !== undefined) profile.locationCity = input.locationCity;
    if (input.locationState !== undefined) profile.locationState = input.locationState;
    if (input.phone !== undefined) profile.phone = input.phone;

    // Recalculate profile completion
    profile.profileCompletion = this.calculateCompletion(profile);

    return this.profileRepo.save(profile);
  }

  private calculateCompletion(profile: Profile): number {
    let filled = 0;
    const fields = [
      profile.fullName,
      profile.email,
      profile.phone,
      profile.tradeCategory,
      profile.specialty,
      profile.yearsExperience > 0 ? 'yes' : null,
      profile.locationCity,
      profile.locationState,
      profile.avatarUrl,
    ];
    for (const f of fields) {
      if (f) filled++;
    }
    return Math.round((filled / fields.length) * 100);
  }
}
