import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RequestWithUser } from '@auth/interfaces/requestWithUser.interface';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { CreateProfileDto } from '@root/profile/dto/create-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProfile(
    @Req() req: RequestWithUser,
    @Body() createProfileDto: CreateUserDto,
  ) {
    return await this.profileService.createProfile(req.user, createProfileDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateProfileByUser(
    @Req() req: RequestWithUser,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return await this.profileService.updateProfileByUser(
      req.user,
      createProfileDto,
    );
  }
}
