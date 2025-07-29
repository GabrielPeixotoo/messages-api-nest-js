import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { HashingService } from 'src/auth/hashing/hash.service';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly hashService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const passwordHash = await this.hashService.hash(createUserDto.password);
      const user = {
        name: createUserDto.name,
        passwordHash,
        email: createUserDto.email,
      };
      const newUser = this.userRepository.create(user);
      const savedUser = await this.userRepository.save(newUser);
      return savedUser;
    } catch (error) {
      if (this.isQueryFailedError(error) && error.code === '23505') {
        throw new ConflictException('Duplicated email');
      }
      throw error;
    }
  }

  isQueryFailedError(
    error: unknown,
  ): error is QueryFailedError & { code: string } {
    return (
      error instanceof QueryFailedError &&
      typeof (error as QueryFailedError & { code?: unknown }).code === 'string'
    );
  }

  findAll() {
    const users = this.userRepository.find({
      order: {
        id: 'desc',
      },
    });
    return users;
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const userData = {
      name: updateUserDto?.name,
    };

    if (updateUserDto?.password) {
      const passwordHash = await this.hashService.hash(updateUserDto?.password);

      userData['passwordHash'] = passwordHash;
    }

    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user)
      throw new NotFoundException('Message to be updated was not found');

    if (user.id != tokenPayload.sub) {
      throw new ForbiddenException(
        'User is not the one that you are trying to update.',
      );
    }
    return await this.userRepository.save(user);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.id != tokenPayload.sub) {
      throw new ForbiddenException(
        'User is not the one that you are trying to delete.',
      );
    }

    return this.userRepository.remove(user);
  }
}
