import { FileUtil } from '@common/utils/file.util';
import { createUpdateData } from '@common/utils/updateData.util';
import { CastService } from '@modules/content/cast/cast.service';
import { FranchiseService } from '@modules/content/franchise/franchise.service';
import type { CreateGameType } from '@modules/content/game/types/createGame.type';
import type { GetGamesType } from '@modules/content/game/types/getGames.type';
import type { UpdateGameType } from '@modules/content/game/types/updateGame.type';
import { Injectable } from '@nestjs/common';
import { Game, Prisma } from '@prisma/client';
import { PrismaService } from '@prismaPath/prisma.service';

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUtil: FileUtil,
    private readonly castService: CastService,
    private readonly franchiseService: FranchiseService,
  ) {}

  async getGame(id: number): Promise<Game> {
    const existingGame = await this.prisma.game.findUnique({
      where: { id: id },
    });

    if (!existingGame) {
      throw new Error('Game not found');
    }

    return existingGame;
  }

  async getGames(getGamesData: GetGamesType): Promise<Game[]> {
    const { page, pageSize, sortField, sortOrder, genreIds, themeIds } =
      getGamesData;

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
      where: {
        AND: [
          genreIds ? { genres: { some: { id: { in: genreIds } } } } : undefined,
          themeIds ? { themes: { some: { id: { in: themeIds } } } } : undefined,
        ],
      },
    });
  }

  async createGame(createGameData: CreateGameType): Promise<Game> {
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
    } = createGameData;

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
        title: title,
        description: description,
        posterPath: posterPath,
        release: release,
        status: status,
        duration: duration,
        ageRating: ageRating,
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
      },
    });

    await this.franchiseService.addToFranchises({
      franchiseIds: franchise_ids,
      contentId: game.id,
      contentType: 'GAME',
    });

    if (cast && cast.length > 0) {
      const updatedCast = cast.map((c) => ({ ...c, contentId: game.id }));
      await this.castService.createCastByArray(updatedCast);
    }

    return game;
  }

  async updateGame(updateGameData: UpdateGameType): Promise<Game> {
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
    } = updateGameData;

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

    const updateData = createUpdateData({
      title,
      description,
      release,
      status,
      duration,
      ageRating,
      posterPath,
      developers: developers_ids,
      publishers: publishers_ids,
      platforms: platforms_ids,
      themes: themes_ids,
      genres: genres_ids,
      GameFranchise: franchise_ids,
    });

    const game = await this.prisma.game.update({
      where: { id },
      data: updateData,
    });

    if (cast && cast.length > 0) {
      await this.castService.updateCasts(cast);
    }

    return game;
  }

  async deleteGame(id: number): Promise<Game> {
    return this.prisma.game.delete({ where: { id } });
  }
}
