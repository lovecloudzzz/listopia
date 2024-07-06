import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prismaPath/prisma.service';
import { ContentType, Genre } from '@prisma/client';
import { CreateGenreDto } from '@modules/content/genre/dto/createGenre.dto';
import { UpdateGenreDto } from '@modules/content/genre/dto/updateGenre.dto';

@Injectable()
export class GenreService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllGenres(): Promise<Genre[]> {
    return this.prisma.genre.findMany();
  }

  async getGenresByType(type: ContentType): Promise<Genre[]> {
    return this.prisma.genre.findMany({
      where: {
        genreType: {
          has: type,
        },
      },
    });
  }

  async createGenre(createGenreDto: CreateGenreDto): Promise<Genre> {
    const { name, description, types } = createGenreDto;
    const existingGenre = await this.prisma.genre.findFirst({
      where: { name: name.toLowerCase() },
    });

    if (existingGenre) {
      throw new Error(`Genre with NAME ${name} already exists`);
    }

    return this.prisma.genre.create({
      data: {
        name: name.toLowerCase(),
        description,
        genreType: { set: types },
      },
    });
  }

  async updateGenre(updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const { id, name, description, types } = updateGenreDto;
    const existingGenre = await this.prisma.genre.findUnique({
      where: { id },
    });

    if (!existingGenre) {
      throw new Error(`Genre with ID ${id} does not exist`);
    }

    return this.prisma.genre.update({
      where: { id },
      data: {
        name: name.toLowerCase() ?? existingGenre.name,
        description: description ?? existingGenre.description,
        genreType: types ?? existingGenre.genreType,
      },
    });
  }

  async deleteGenre(id: number): Promise<Genre> {
    const existingGenre = await this.prisma.genre.findUnique({
      where: { id },
    });

    if (!existingGenre) {
      throw new Error(`Genre with ID ${id} does not exist`);
    }
    return this.prisma.genre.delete({
      where: {
        id: id,
      },
    });
  }
}
