import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import { resolve } from 'node:path';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { HashingService } from 'src/auth/hashing/hash.service';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

jest.mock('fs/promises')

describe('UsersService', () => {
  let sut: UsersService;
  let userRepository: Repository<UserEntity>;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
      ],
    }).compile();

    sut = module.get(UsersService);
    userRepository = module.get(getRepositoryToken(UserEntity));
    hashingService = module.get(HashingService);
  });
  it('UserService should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('Create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'a@a.com',
        name: 'Gabriel',
        password: '123456',
      };

      const passwordHash = 'HASHPASSWORD';
      const newUser = {
        id: 1,
        name: createUserDto.name,
        passwordHash,
        email: createUserDto.email,
        picture: createUserDto.picture,
      }

      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
      jest.spyOn(userRepository, 'create').mockReturnValue(newUser as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue(newUser as any);

      const result = await sut.create(createUserDto);

      expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);

      expect(userRepository.create).toHaveBeenCalledWith({
        name: createUserDto.name,
        passwordHash: passwordHash,
        email: createUserDto.email,
        picture: createUserDto.picture
      })
      expect(userRepository.save).toHaveBeenCalledWith(newUser)
      expect(result).toEqual(newUser);
    });

    it('Should launch ConflictException when e-mail already exists', async () => {

      const userDto = {
        email: 'a@a.com',
        name: 'Gabriel',
        password: '123456'
      };

      const error = new QueryFailedError('', [], new Error()) as any;
      error.code = '23505';
      jest.spyOn(userRepository, 'save').mockRejectedValue(error)

      await expect(sut.create(userDto)).rejects.toThrow(
        ConflictException
      )
    })

    it('Should launch ConflictException when e-mail already exists', async () => {

      const userDto = {
        email: 'a@a.com',
        name: 'Gabriel',
        password: '123456'
      };

      jest.spyOn(userRepository, 'save').mockRejectedValue(new Error('Erro genérico'))

      await expect(sut.create(userDto)).rejects.toThrow(
        new Error('Erro genérico')
      )
    })

  });

  describe('findOne', () => {

    it('Should return an user when findOne is called', async () => {
      const userId = 1;
      const foundUser = {
        id: userId,
        name: 'Gabriel',
        email: 'a@a.com',
        passwordHash: '123456'
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(foundUser as any)

      const result = await sut.findOne(userId);
      expect(result).toEqual(foundUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: userId,
        },
      });
    })

    it('Should throw NotFoundException when an user is not found', async () => {
      await expect(sut.findOne(1)).rejects.toThrow(new NotFoundException('User not found'));
    })
  })

  describe('findOne', () => {

    it('Should return an user when findOne is called', async () => {
      const userId = 1;
      const foundUser = {
        id: userId,
        name: 'Gabriel',
        email: 'a@a.com',
        passwordHash: '123456'
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(foundUser as any)

      const result = await sut.findOne(userId);
      expect(result).toEqual(foundUser);
    })

    it('Should throw NotFoundException when an user is not found', async () => {
      await expect(sut.findOne(1)).rejects.toThrow(new NotFoundException('User not found'));
    })
  })


  describe('findAll', () => {

    it('Should return list of users', async () => {

      const mockedUsers: UserEntity[] = [
        {
          id: 1,
          name: 'Joao',
          email: 'b@b.com',
          passwordHash: '123456'
        } as UserEntity,
        {
          id: 2,
          name: 'Gabriel',
          email: 'b@b.com',
          passwordHash: '123456'
        } as UserEntity,
      ]
      jest.spyOn(userRepository, 'find').mockResolvedValue(mockedUsers)
      const users = await sut.findAll();
      expect(users).toEqual(mockedUsers)
      expect(userRepository.find).toHaveBeenCalledWith({
        order: {
          id: 'desc'
        }
      })
    });
  })


  describe('update', () => {

    it('Should update user if user is valid and is the one updating itself', async () => {

      const idToBeUpdated = 1;

      const updateUserDto = {
        email: 'a@a.com',
        name: 'Gabriel',
        password: '123456',
      };

      const tokenPayload: TokenPayloadDto = {
        sub: 1,
        email: 'a@a.com',
        iat: 12345,
        exp: 12345,
        aud: 'http://localhost:3000',
        iss: 'http://localhost:3000',
      };

      const passwordHash = 'HASHPASSWORD';

      const updatedUser = {
        id: idToBeUpdated,
        name: updateUserDto.name,
        passwordHash,
        email: updateUserDto.email,
      };

      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
      jest.spyOn(userRepository, 'preload').mockResolvedValue(updatedUser as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser as any);

      const result = await sut.update(idToBeUpdated, updateUserDto, tokenPayload);

      expect(hashingService.hash).toHaveBeenCalledTimes(1);
      expect(hashingService.hash).toHaveBeenCalledWith(updateUserDto.password);
      expect(userRepository.preload).toHaveBeenCalledWith({ id: idToBeUpdated, ...updateUserDto });
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('Should throw NotFoundException if user is not found', async () => {
      await expect(
        sut.update(1, { name: 'Test' }, { sub: 1 } as any),
      ).rejects.toThrow(new NotFoundException('User to be updated was not found'));
    });

    it('Should throw ForbiddenException if user is not found', async () => {
      const idToBeUpdated = 1;

      const updateUserDto = {
        email: 'a@a.com',
        name: 'Gabriel',
        password: '123456',
      };

      const tokenPayload: TokenPayloadDto = {
        sub: idToBeUpdated,
        email: 'a@a.com',
        iat: 12345,
        exp: 12345,
        aud: 'http://localhost:3000',
        iss: 'http://localhost:3000',
      };

      const passwordHash = 'HASHPASSWORD';

      const preloadedUser = {
        id: idToBeUpdated + 1,
        name: updateUserDto.name,
        passwordHash,
        email: updateUserDto.email,
      };

      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
      jest.spyOn(userRepository, 'preload').mockResolvedValue(preloadedUser as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue(preloadedUser as any);

      await expect(
        sut.update(1, { name: 'Test' }, { sub: 1 } as any),
      ).rejects.toThrow(new ForbiddenException(
        'User is not the one that you are trying to update.',
      ));
    });
  })

  describe('remove', () => {
    it('Should remove user if it is authorized', async () => {

      const userId = 1;

      const existingUser = {
        id: userId,
        name: 'John Doe',
      };

      const tokenPayload: TokenPayloadDto = {
        sub: userId,
        email: 'a@a.com',
        iat: 12345,
        exp: 12345,
        aud: 'http://localhost:3000',
        iss: 'http://localhost:3000',
      };

      jest.spyOn(sut, 'findOne').mockResolvedValue(existingUser as any);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(existingUser as any);

      const result = await sut.remove(userId, tokenPayload);

      expect(sut.findOne).toHaveBeenCalledWith(userId);
      expect(userRepository.remove).toHaveBeenCalledWith(existingUser);
      expect(result).toEqual(existingUser);
    });

    it('Should throw NotFoundException if user is not found', async () => {

      await expect(sut.remove(1, { sub: 1 } as any)).rejects.toThrow(
        new NotFoundException('User not found')
      );
    });

    it('Should throw ForbiddenException if user is not the one being removed', async () => {
      const userId = 1;

      const existingUser = {
        id: userId + 1,
        name: 'John Doe',
      };

      jest.spyOn(sut, 'findOne').mockResolvedValue(existingUser as any);
      await expect(sut.remove(1, { sub: userId } as any)).rejects.toThrow(
        new ForbiddenException(
          'User is not the one that you are trying to delete.',
        )
      );
    });
  })

  describe('uploadPicture', () => {
    it('Should upload picture successfully', async () => {

      const file = {
        originalname: 'test.png',
        size: 2000,
        buffer: Buffer.from('file content'),
      } as Express.Multer.File;

      const tokenPayload = { sub: 1 } as any;
      const foundUser = { id: 1, name: 'Gabriel' } as UserEntity;

      const fileName = `${tokenPayload.sub}.png`;
      const fileFullPath = resolve(process.cwd(), 'pictures', fileName);

      jest.spyOn(sut, 'findOne').mockResolvedValue(foundUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...foundUser,
        picture: fileName,
      } as any);
      jest.spyOn(userRepository, 'preload').mockResolvedValue({
        ...foundUser,
        picture: fileName,
      } as any);


      const result = await sut.uploadPicture(file, tokenPayload);

      expect(fs.writeFile).toHaveBeenCalledWith(fileFullPath, file.buffer);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...foundUser,
        picture: fileName,
      });

    })
  })
});
