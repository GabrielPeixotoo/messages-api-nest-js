import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import { extname, resolve } from 'path';
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
  ) { }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const passwordHash = await this.hashService.hash(createUserDto.password);
      const user = {
        name: createUserDto.name,
        passwordHash,
        email: createUserDto.email,
        picture: createUserDto.picture,
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

    if (!user) throw new NotFoundException('User not found');

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
      throw new NotFoundException('User to be updated was not found');

    if (user.id != tokenPayload.sub) {
      throw new ForbiddenException(
        'User is not the one that you are trying to update.',
      );
    }
    return await this.userRepository.save(user);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const user = await this.findOne(id);

    if (user.id != tokenPayload.sub) {
      throw new ForbiddenException(
        'User is not the one that you are trying to delete.',
      );
    }

    return this.userRepository.remove(user);
  }

  async uploadPicture(
    file: Express.Multer.File,
    tokenPayload: TokenPayloadDto,
  ) {
    const fileExtension = extname(file.originalname).toLowerCase().substring(1);

    const fileName = `${tokenPayload.sub}.${fileExtension}`;

    const fileFullPath = resolve(process.cwd(), 'pictures', fileName);

    await fs.writeFile(fileFullPath, file.buffer);

    const user = await this.findOne(tokenPayload.sub);

    await this.update(
      user.id,
      {
        picture: fileName,
      },
      tokenPayload,
    );

    return user;
  }
}
