import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '@root/profile/entities/profile.entity';
import { Repository } from 'typeorm';
import { UserService } from '@user/user.service';
import { User } from '@user/entities/user.entity';
import { CreateProfileDto } from '@root/profile/dto/create-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly userService: UserService,
  ) {}

  async createProfile(user: User, createProfileDto: CreateProfileDto) {
    const newProfile = await this.profileRepository.create({
      ...createProfileDto,
      user,
    });
    await this.profileRepository.save(newProfile);
    return newProfile;
  }

  async updateProfileByUser(user: User, createProfileDto: CreateProfileDto) {
    const userInfo = await this.userService.getUserById(user.id);
    return await this.profileRepository.update(
      { id: userInfo.profile.id },
      createProfileDto,
    );
  }
}