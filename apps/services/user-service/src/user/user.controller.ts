import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly user: UserService) {}

  @Post()
  @HttpCode(200)
  async create(@Body() createUserDto: CreateUserDto) {
    await this.user.createUser(createUserDto);
    return { message: 'User created successfully' };
  }

  @Patch('update')
  async update(@Body() updateUserDto: UpdateUserDto) {
    await this.user.updateUser(updateUserDto);
    return { message: 'User updated' };
  }

  @Get(':email')
  getUserByEmail(@Param('email') email: string) {
    return this.user.getUserByEmail(email);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    await this.user.loginUser(loginUserDto);
    return { message: `welcome back` };
  }
}
