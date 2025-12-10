import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateUserDto,
  UpdateUserDto,
  LoginUserDto,
  GetUserDto,
} from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.repo.findOneBy({
      email: createUserDto.email,
    });
    if (user) {
      throw new ConflictException('User with this email already exists');
    } else {
      const newUser = this.repo.create(createUserDto);
      return this.repo.save(newUser);
    }
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.repo.findOneBy({
      email: updateUserDto.email,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.repo.update({ email: updateUserDto.email }, updateUserDto);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.repo.findOneBy({
      email: loginUserDto.email,
    });
    if (!user || user.password !== loginUserDto.password) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<GetUserDto> {
    const user = await this.repo.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { name, company, createdAt } = user;
    return { email, name, company, createdAt };
  }
}
