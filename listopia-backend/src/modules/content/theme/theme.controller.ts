import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { ThemeService } from '@modules/content/theme/theme.service';
import { CreateThemeDto } from '@modules/content/theme/dto/createTheme.dto';
import { UpdateThemeDto } from '@modules/content/theme/dto/updateTheme.dto';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/guards/roles.decorator';

@Controller('theme')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post('createTheme')
  async createTheme(@Body() createThemeDto: CreateThemeDto) {
    return this.themeService.createTheme(createThemeDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post(':id/update')
  async updateTheme(
    @Param('id') id: number,
    @Body() updateThemeDto: UpdateThemeDto,
  ) {
    updateThemeDto.id = id;
    return this.themeService.updateTheme(updateThemeDto);
  }

  @UseGuards(RolesGuard)
  @Roles('Admin', 'Developer', 'Editor')
  @Post(':id/delete')
  async deleteTheme(@Param('id') id: number) {
    return this.themeService.deleteTheme(id);
  }

  @Get('')
  async getAllThemes() {
    return this.themeService.getAllThemes();
  }
}
