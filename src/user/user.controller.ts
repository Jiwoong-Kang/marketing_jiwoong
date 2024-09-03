import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import RoleGuard from '@auth/guards/role.guard';
import { Role } from '@common/enums/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(RoleGuard(Role.ADMIN))
  @Get('/all')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}
