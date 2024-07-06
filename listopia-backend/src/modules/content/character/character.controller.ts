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
import { CharacterService } from './character.service';
import { Character } from '@prisma/client';
import { GetCharactersDto } from '@modules/content/character/dto/getCharacters.dto';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/guards/roles.decorator';
import { UpdateCharacterDto } from '@modules/content/character/dto/updateCharacter.dto';
import { CreateCharacterDto } from '@modules/content/character/dto/createCharacter.dto';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get(':id')
  async getCharacter(@Param('id') id: number): Promise<Character> {
    return this.characterService.getCharacter(id);
  }

  @Get()
  async getCharacters(
    @Query() getCharacterDto: GetCharactersDto,
  ): Promise<Character[]> {
    return this.characterService.getCharacters(getCharacterDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createCharacter(
    @Body() createCharacterDto: CreateCharacterDto,
  ): Promise<Character> {
    return this.characterService.createCharacter(createCharacterDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put()
  async updateCharacter(
    @Body() updateCharacterDto: UpdateCharacterDto,
  ): Promise<Character> {
    return this.characterService.updateCharacter(updateCharacterDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deleteCharacter(@Param('id') id: number): Promise<Character> {
    return this.characterService.deleteCharacter(id);
  }
}
