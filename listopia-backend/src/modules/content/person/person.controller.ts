import { Roles } from '@common/guards/RolesGuard/roles.decorator';
import { RolesGuard } from '@common/guards/RolesGuard/roles.guard';
import type { CreatePersonType } from '@modules/content/person/types/createPerson.type';
import type { GetPersonsType } from '@modules/content/person/types/getPersons.type';
import type { GetPersonsByCareerType } from '@modules/content/person/types/getPersonsByCareer.type';
import type { UpdatePersonTypeWithoutId } from '@modules/content/person/types/updatePerson.type';
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
import { Person, PersonCareer } from '@prisma/client';
import { PersonService } from './person.service';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get(':id')
  async getPerson(@Param('id') id: number): Promise<Person> {
    return this.personService.getPerson(id);
  }

  @Get()
  async getPersons(@Query() getPersonsData: GetPersonsType): Promise<Person[]> {
    return this.personService.getPersons(getPersonsData);
  }

  @Get('career/:career')
  async getPersonsByCareer(
    @Param('career') career: PersonCareer,
    @Query() getPersonsByCareerData: GetPersonsByCareerType,
  ): Promise<Person[]> {
    return this.personService.getPersonsByCareer({
      ...getPersonsByCareerData,
      career,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createPerson(
    @Body() createPersonData: CreatePersonType,
  ): Promise<Person> {
    return this.personService.createPerson(createPersonData);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put('id')
  async updatePerson(
    @Body() updatePersonData: UpdatePersonTypeWithoutId,
    @Param('id') id: number,
  ): Promise<Person> {
    return this.personService.updatePerson({ ...updatePersonData, id: id });
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deletePerson(@Param('id') id: number): Promise<Person> {
    return this.personService.deletePerson(id);
  }
}
