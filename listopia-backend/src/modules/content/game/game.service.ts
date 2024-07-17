import { FileUtil } from '@common/utils/file.util';
import { CastService } from '@modules/content/cast/cast.service';
import { CreateGameDto } from '@modules/content/game/dto/createGame.dto';
import { GetGamesDto } from '@modules/content/game/dto/getGames.dto';
import { UpdateGameDto } from '@modules/content/game/dto/updateGame.dto';
import { Injectable } from '@nestjs/common';
import { Game, Prisma } from '@prisma/client';
import { PrismaService } from '@prismaPath/prisma.service';

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUtil: FileUtil,
    private readonly castService: CastService,
  ) {}

  async getGame(id: number): Promise<Game> {
    const existingGame = this.prisma.game.findUnique({ where: { id: id } });

    if (!existingGame) {
      throw new Error('Game not found');
    }

    return existingGame;
  }

  async getGames(getGamesDto: GetGamesDto): Promise<Game[]> {
    const { page, pageSize, sortField, sortOrder } = getGamesDto;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let orderBy: Prisma.GameOrderByWithRelationInput = {
      visitCount: 'desc',
    };

    if (sortField && sortOrder) {
      orderBy = { [sortField]: sortOrder };
    }

    return this.prisma.game.findMany({
      skip,
      take,
      orderBy,
    });
  }

  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    const {
      title,
      description,
      poster,
      developers_ids,
      publishers_ids,
      platforms_ids,
      themes_ids,
      release,
      genres_ids,
      franchise_ids,
      cast,
      status,
      duration,
      ageRating,
    } = createGameDto;

    let posterPath = '';
    if (poster) {
      posterPath = await this.fileUtil.saveFile({
        file: poster,
        filename: `${title}_${Date.now()}`,
        folder: 'game_posters',
      });
    }

    const game = await this.prisma.game.create({
      data: {
        title,
        description,
        posterPath,
        release,
        status,
        duration,
        ageRating,
        developers: {
          connect: developers_ids.map((id) => ({ id })),
        },
        publishers: {
          connect: publishers_ids.map((id) => ({ id })),
        },
        platforms: {
          connect: platforms_ids.map((id) => ({ id })),
        },
        themes: {
          connect: themes_ids.map((id) => ({ id })),
        },
        genres: {
          connect: genres_ids.map((id) => ({ id })),
        },
        GameFranchise: {
          connect: franchise_ids.map((id) => ({ id })),
        },
      },
    });

    if (cast && cast.length > 0) {
      const updatedCast = cast.map((c) => ({ ...c, contentId: game.id }));
      await this.castService.createCastByArray(updatedCast);
    }

    return game;
  }

  async updateGame(updateGameDto: UpdateGameDto): Promise<Game> {
    const {
      id,
      title,
      description,
      poster,
      developers_ids,
      publishers_ids,
      platforms_ids,
      themes_ids,
      release,
      genres_ids,
      franchise_ids,
      cast,
      status,
      duration,
      ageRating,
    } = updateGameDto;

    const existingGame = await this.prisma.game.findUnique({ where: { id } });
    if (!existingGame) {
      throw new Error('Game not found');
    }

    let posterPath = existingGame.posterPath;
    if (poster) {
      posterPath = await this.fileUtil.updateFile(
        poster,
        existingGame.posterPath,
        `${title}_${Date.now()}`,
        'game_posters',
      );
    }

    const updateData: any = {
      title,
      description,
      release,
      status,
      duration,
      ageRating,
    };

    if (posterPath) {
      updateData.posterPath = posterPath;
    }

    if (developers_ids) {
      updateData.developers = {
        set: developers_ids.map((id) => ({ id })),
      };
    }
    if (publishers_ids) {
      updateData.publishers = {
        set: publishers_ids.map((id) => ({ id })),
      };
    }

    if (platforms_ids) {
      updateData.platforms = {
        set: platforms_ids.map((id) => ({ id })),
      };
    }

    if (themes_ids) {
      updateData.themes = {
        set: themes_ids.map((id) => ({ id })),
      };
    }

    if (genres_ids) {
      updateData.genres = {
        set: genres_ids.map((id) => ({ id })),
      };
    }

    if (franchise_ids) {
      updateData.GameFranchise = {
        set: franchise_ids.map((id) => ({ id })),
      };
    }

    const game = await this.prisma.game.update({
      where: { id },
      data: updateData,
    });

    if (cast && cast.length > 0) {
      await this.castService.updateCastByArray(cast);
    }

    return game;
  }

  async deleteGame(id: number): Promise<Game> {
    return this.prisma.game.delete({ where: { id } });
  }
}
