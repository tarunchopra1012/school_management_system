import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createAuthorDto: CreateUserDto) {
    const result = await this.usersService.create(createAuthorDto);
    return {
      success: true,
      message: 'User created successfully',
      user: result,
    };
  }

  @Post('signin')
  signIn(@Body() body: SignInDto) {
    return this.usersService.signIn(body);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
