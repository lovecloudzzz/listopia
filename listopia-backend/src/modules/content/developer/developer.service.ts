import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prismaPath/prisma.service';
import { FileUtil } from '@common/utils/file.util';
import { Developer, Prisma } from '@prisma/client';
import { GetDevelopersDto } from '@modules/content/developer/dto/getDevelopers.dto';
import { CreateDeveloperDto } from '@modules/content/developer/dto/createDeveloper.dto';
import { UpdateDeveloperDto } from '@modules/content/developer/dto/updateDeveloperDto';

@Injectable()
export class DeveloperService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUtil: FileUtil,
  ) {}

  async getDeveloper(id: number): Promise<Developer> {
    const existingDeveloper = await this.prisma.developer.findUnique({
      where: { id: id },
    });

    if (!existingDeveloper) {
      throw new Error('Developer not found');
    }
    this.prisma.developer.update({
      where: { id: id },
      data: { visitCount: existingDeveloper.visitCount + 1 },
    });

    return this.prisma.developer.findUnique({ where: { id } });
  }

  async getDevelopers(
    getDevelopersDto: GetDevelopersDto,
  ): Promise<Developer[]> {
    const { page, pageSize, sortField, sortOrder } = getDevelopersDto;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let orderBy: Prisma.DeveloperOrderByWithRelationInput = {
      visitCount: 'desc',
    };

    if (sortField && sortOrder) {
      orderBy = { [sortField]: sortOrder };
    }

    return this.prisma.developer.findMany({
      skip,
      take,
      orderBy,
    });
  }

  async createDeveloper(
    createDeveloperDto: CreateDeveloperDto,
  ): Promise<Developer> {
    const { name, description, logo } = createDeveloperDto;

    let logoPath = '';
    if (logo) {
      logoPath = await this.fileUtil.saveFile({
        file: logo,
        filename: `${name}_${Date.now()}`,
        folder: 'developers_logos',
      });
    }

    return this.prisma.developer.create({
      data: {
        name: name,
        description: description,
        logoPath: logoPath,
      },
    });
  }

  async updateDeveloper(
    updateDeveloperDto: UpdateDeveloperDto,
  ): Promise<Developer> {
    const { id, name, description, logo } = updateDeveloperDto;

    const existingDeveloper = await this.prisma.developer.findUnique({
      where: { id: id },
    });

    if (!existingDeveloper) {
      throw new Error('Developer not found');
    }

    let logoPath = existingDeveloper.logoPath;
    if (logo) {
      if (logoPath) {
        logoPath = await this.fileUtil.updateFile(
          logo,
          logoPath,
          `${name}_${Date.now()}`,
          'developers_logos',
        );
      } else {
        logoPath = await this.fileUtil.saveFile({
          file: logo,
          filename: `${name}_${Date.now()}`,
          folder: 'developers_logos',
        });
      }
    }

    return this.prisma.developer.update({
      where: { id },
      data: {
        name: name ?? existingDeveloper.name,
        description: description ?? existingDeveloper.description,
        logoPath: logoPath ?? existingDeveloper.logoPath,
      },
    });
  }

  async deleteDeveloper(id: number): Promise<Developer> {
    const existingDeveloper = await this.prisma.developer.findUnique({
      where: { id: id },
    });

    if (!existingDeveloper) {
      throw new Error('Developer not found');
    }

    if (existingDeveloper.logoPath) {
      await this.fileUtil.deleteFile(existingDeveloper.logoPath);
    }

    return this.prisma.developer.delete({ where: { id: id } });
  }
}
