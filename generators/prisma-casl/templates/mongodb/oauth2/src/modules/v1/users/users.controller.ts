import {
  Controller,
  Get,
  NotFoundException,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import RequestUser from '@decorators/request-user.decorator';
import { Roles, RolesEnum } from '@decorators/roles.decorator';

import IsLoggedGuard from '@guards/is-logged.guard';
import { User } from '@prisma/client';
import Serialize from '@decorators/serialization.decorator';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import UsersResponseDto, { UserResponseDto } from '@v1/users/dto/user-response.dto';
import PoliciesGuard from '@guards/casl-roles.guard';
import UsersService from './users.service';

@ApiTags('users')
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOkResponse({
    type: UsersResponseDto,
    description: 'Returns all verified users',
  })
  @ApiUnauthorizedResponse({
    description: '401. UnauthorizedError',
  })
  @Get()
  @UseGuards(PoliciesGuard)
  @Serialize(UsersResponseDto)
  @Roles(RolesEnum.ADMIN)
  async getAllVerified(): Promise<User[]> {
    return this.usersService.getAllVerified();
  }

  @ApiOkResponse({
    type: UserResponseDto,
    description: 'Returns a found user',
  })
  @ApiNotFoundResponse({ description: '404...' })
  @Get('/profile')
  @Serialize(UserResponseDto)
  @UseGuards(IsLoggedGuard)
  async getById(
    @RequestUser() user: User,
  ): Promise<User | never> {
    const foundUser = await this.usersService.getVerifiedUserById(user.id) as User;

    if (!foundUser) {
      throw new NotFoundException('The user does not exist');
    }

    return foundUser;
  }
}
