import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prismaPath/prisma.service';
import { FileUtil } from '@common/utils/file.util';
import { GetCastDto } from '@modules/content/cast/dto/getCast.dto';
import { CreateCastDto } from '@modules/content/cast/dto/createCast.dto';
import { BookCast, ContentType, GameCast, MovieCast } from '@prisma/client';
import { UpdateCastDto } from '@modules/content/cast/dto/updateCast.dto';
import { DeleteCastDto } from '@modules/content/cast/dto/deleteCast.dto';

@Injectable()
export class CastService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUtil: FileUtil,
  ) {}

  async getCast(
    getCastDto: GetCastDto,
  ): Promise<(BookCast | MovieCast | GameCast)[]> {
    const { contentId, contentType } = getCastDto;
    const whereCondition: { [key: string]: number } = this.createWhereCondition(
      contentId,
      contentType,
    );

    switch (contentType) {
      case 'BOOK':
        return this.prisma.bookCast.findMany({
          where: whereCondition,
          orderBy: { roleType: 'asc' },
        });
      case 'MOVIE':
        return this.prisma.movieCast.findMany({
          where: whereCondition,
          orderBy: { roleType: 'asc' },
        });
      case 'GAME':
        return this.prisma.gameCast.findMany({
          where: whereCondition,
          orderBy: { roleType: 'asc' },
        });
      default:
        throw new Error('Invalid content type');
    }
  }

  private createWhereCondition(
    contentId: number,
    contentType: ContentType,
  ): { [key: string]: number } {
    const whereCondition: { [key: string]: number } = {};

    switch (contentType) {
      case 'BOOK':
        whereCondition.bookId = contentId;
        break;
      case 'MOVIE':
        whereCondition.movieId = contentId;
        break;
      case 'GAME':
        whereCondition.gameId = contentId;
        break;
      default:
        throw new Error('Invalid content type');
    }

    return whereCondition;
  }

  async createCast(
    createCastDto: CreateCastDto,
  ): Promise<BookCast | MovieCast | GameCast> {
    const {
      contentId,
      contentType,
      roleName,
      roleActor,
      rolePhoto,
      roleType,
      characterId,
      actorId,
    } = createCastDto;

    let rolePhotoPath: string | undefined = undefined;
    if (rolePhoto) {
      rolePhotoPath = await this.fileUtil.saveFile({
        file: rolePhoto,
        filename: rolePhoto.originalname,
        folder: 'casts-photos',
      });
    }

    const data: any = {
      roleName,
      roleActor,
      rolePhotoPath: rolePhotoPath,
      roleType,
      characterId,
      actorId,
    };

    switch (contentType) {
      case 'BOOK':
        data.bookId = contentId;
        return this.prisma.bookCast.create({ data });
      case 'MOVIE':
        data.movieId = contentId;
        return this.prisma.movieCast.create({ data });
      case 'GAME':
        data.gameId = contentId;
        return this.prisma.gameCast.create({ data });
      default:
        throw new Error('Invalid content type');
    }
  }

  async createCastByArray(
    createCastDtos: CreateCastDto[],
  ): Promise<(BookCast | MovieCast | GameCast)[]> {
    const casts = [];

    for (const createCastDto of createCastDtos) {
      const cast = await this.createCast(createCastDto);
      casts.push(cast);
    }

    return casts;
  }

  async updateCast(
    updateCastDto: UpdateCastDto,
  ): Promise<BookCast | MovieCast | GameCast> {
    const {
      id,
      contentId,
      contentType,
      roleName,
      roleActor,
      rolePhoto,
      roleType,
      characterId,
      actorId,
    } = updateCastDto;

    let rolePhotoPath: string | undefined = undefined;
    if (rolePhoto) {
      rolePhotoPath = await this.fileUtil.saveFile({
        file: rolePhoto,
        filename: rolePhoto.originalname,
        folder: 'casts-photos',
      });
    }

    const data: any = {
      roleName,
      roleActor,
      rolePhotoPath: rolePhotoPath,
      roleType,
      characterId,
      actorId,
      contentId,
    };

    switch (contentType) {
      case 'BOOK':
        return this.prisma.bookCast.update({
          where: { id },
          data,
        });
      case 'MOVIE':
        return this.prisma.movieCast.update({
          where: { id },
          data,
        });
      case 'GAME':
        return this.prisma.gameCast.update({
          where: { id },
          data,
        });
      default:
        throw new Error('Invalid content type');
    }
  }

  async updateCastByArray(
    updateCastDtos: UpdateCastDto[],
  ): Promise<(BookCast | MovieCast | GameCast)[]> {
    const casts = [];

    for (const updateCastDto of updateCastDtos) {
      const cast = await this.updateCast(updateCastDto);
      casts.push(cast);
    }

    return casts;
  }

  async deleteCast(
    deleteCastDto: DeleteCastDto,
  ): Promise<BookCast | MovieCast | GameCast> {
    const { id, contentType } = deleteCastDto;

    switch (contentType) {
      case 'BOOK':
        return this.prisma.bookCast.delete({
          where: { id },
        });
      case 'MOVIE':
        return this.prisma.movieCast.delete({
          where: { id },
        });
      case 'GAME':
        return this.prisma.gameCast.delete({
          where: { id },
        });
      default:
        throw new Error('Invalid content type');
    }
  }
}
