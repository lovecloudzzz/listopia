import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import { CreateGameDto } from '@modules/content/game/dto/createGame.dto';
import { GetGamesDto } from '@modules/content/game/dto/getGames.dto';
import { UpdateGameDto } from '@modules/content/game/dto/updateGame.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Game } from '@prisma/client';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':id')
  async getGame(@Param('id') id: number): Promise<Game> {
    return this.gameService.getGame(id);
  }

  @Get()
  async getGames(@Query() getGamesDto: GetGamesDto): Promise<Game[]> {
    return this.gameService.getGames(getGamesDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createGame(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gameService.createGame(createGameDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put()
  async updateGame(@Body() updatePersonDto: UpdateGameDto): Promise<Game> {
    return this.gameService.updateGame(updatePersonDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deleteGame(@Param('id') id: number): Promise<Game> {
    return this.gameService.deleteGame(id);
  }
}
