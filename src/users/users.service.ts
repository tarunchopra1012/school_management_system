import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import PostgreSQLErrorCode from '../common/postgresql-error-codes';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    // Generate a salt using bcrypt
    const salt = await bcrypt.genSalt();
    // Hash the password along with the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user with the hashed password
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    try {
      const savedUser = await this.userRepository.save(user);

      // Return the saved user but exclude the password
      const { password, ...result } = savedUser;
      return result;
    } catch (error) {
      console.log(error.code);
      if (error.code === PostgreSQLErrorCode.UniqueViolation) {
        throw new ConflictException('Email already in use.');
      }
      throw error;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOneBy({
      email: signInDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(signInDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      id: user.id,
      email: signInDto.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  findAll() {
    return this.userRepository.find();
  }
}
