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
import { PersonService } from './person.service';
import { CreatePersonDto } from '@modules/content/person/dto/createPerson.dto';
import { UpdatePersonDto } from '@modules/content/person/dto/updatePerson.dto';
import { Person, PersonCareer } from '@prisma/client';
import { GetPersonsDto } from '@modules/content/person/dto/getPersons.dto';
import { GetPersonsByCareerDto } from '@modules/content/person/dto/getPersonsByCareer.dto';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/guards/roles.decorator';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get(':id')
  async getPerson(@Param('id') id: number): Promise<Person> {
    return this.personService.getPerson(id);
  }

  @Get()
  async getPersons(@Query() getPersonsDto: GetPersonsDto): Promise<Person[]> {
    return this.personService.getPersons(getPersonsDto);
  }

  @Get('career/:career')
  async getPersonsByCareer(
    @Param('career') career: PersonCareer,
    @Query() getPersonsByCareerDto: GetPersonsByCareerDto,
  ): Promise<Person[]> {
    return this.personService.getPersonsByCareer({
      ...getPersonsByCareerDto,
      career,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post()
  async createPerson(
    @Body() createPersonDto: CreatePersonDto,
  ): Promise<Person> {
    return this.personService.createPerson(createPersonDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Put()
  async updatePerson(
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<Person> {
    return this.personService.updatePerson(updatePersonDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Delete(':id')
  async deletePerson(@Param('id') id: number): Promise<Person> {
    return this.personService.deletePerson(id);
  }
}
