import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prismaPath/prisma.service';
import { FileUtil } from '@common/utils/file.util';
import { Character, Prisma } from '@prisma/client';
import { GetCharactersDto } from '@modules/content/character/dto/getCharacters.dto';
import { CreateCharacterDto } from '@modules/content/character/dto/createCharacter.dto';
import { UpdateCharacterDto } from '@modules/content/character/dto/updateCharacter.dto';

@Injectable()
export class CharacterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUtil: FileUtil,
  ) {}

  async getCharacter(id: number): Promise<Character> {
    const existingCharacter = this.prisma.character.findUnique({
      where: { id: id },
    });

    if (!existingCharacter) {
      throw new Error('Character not found');
    }

    return existingCharacter;
  }

  async getCharacters(
    getCharactersDto: GetCharactersDto,
  ): Promise<Character[]> {
    const { page, pageSize, sortField, sortOrder } = getCharactersDto;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let orderBy: Prisma.CharacterOrderByWithRelationInput = {
      visitCount: 'desc',
    };

    if (sortField && sortOrder) {
      orderBy = { [sortField]: sortOrder };
    }

    return this.prisma.character.findMany({
      skip,
      take,
      orderBy,
    });
  }

  async createCharacter(
    createCharacterDto: CreateCharacterDto,
  ): Promise<Character> {
    const { name, description, photo } = createCharacterDto;

    let photoPath = '';
    if (photo) {
      photoPath = await this.fileUtil.saveFile({
        file: photo,
        filename: `${name}_${Date.now()}`,
        folder: 'characters_photos',
      });
    }

    return this.prisma.character.create({
      data: {
        name: name,
        description: description,
        photoPath: photoPath,
      },
    });
  }

  async updateCharacter(
    updateCharacterDto: UpdateCharacterDto,
  ): Promise<Character> {
    const { id, name, description, photo } = updateCharacterDto;

    const existingCharacter = await this.prisma.person.findUnique({
      where: { id: id },
    });
    if (!existingCharacter) {
      throw new Error('Person not found');
    }

    let photoPath = existingCharacter.photoPath;
    if (photo) {
      if (photoPath) {
        photoPath = await this.fileUtil.updateFile(
          photo,
          photoPath,
          `${name}_${Date.now()}`,
          'characters_photos',
        );
      } else {
        photoPath = await this.fileUtil.saveFile({
          file: photo,
          filename: `${name}_${Date.now()}`,
          folder: 'characters_photos',
        });
      }
    }

    return this.prisma.character.update({
      where: { id },
      data: {
        name: name ?? existingCharacter.name,
        description: description ?? existingCharacter.description,
        photoPath: photoPath ?? existingCharacter.photoPath,
      },
    });
  }

  async deleteCharacter(id: number): Promise<Character> {
    const existingCharacter = await this.prisma.person.findUnique({
      where: { id: id },
    });
    if (!existingCharacter) {
      throw new Error('Character not found');
    }

    if (existingCharacter.photoPath) {
      await this.fileUtil.deleteFile(existingCharacter.photoPath);
    }
    return this.prisma.character.delete({ where: { id: id } });
  }
}
