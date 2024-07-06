import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prismaPath/prisma.service';
import { FileUtil } from '@common/utils/file.util';
import { CreateStudioDto } from '@modules/content/studio/dto/createStudio.dto';
import { GetStudiosDto } from '@modules/content/studio/dto/getStudios.dto';
import { UpdateStudioDto } from '@modules/content/studio/dto/updateStudioDto';
import { Prisma, Studio } from '@prisma/client';

@Injectable()
export class StudioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUtil: FileUtil,
  ) {}

  async getStudio(id: number): Promise<Studio> {
    const existingStudio = await this.prisma.studio.findUnique({
      where: { id: id },
    });

    if (!existingStudio) {
      throw new Error('Studio not found');
    }
    this.prisma.studio.update({
      where: { id: id },
      data: { visitCount: existingStudio.visitCount + 1 },
    });

    return this.prisma.studio.findUnique({ where: { id } });
  }

  async getStudios(getStudiosDto: GetStudiosDto): Promise<Studio[]> {
    const { page, pageSize, sortField, sortOrder } = getStudiosDto;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let orderBy: Prisma.StudioOrderByWithRelationInput = {
      visitCount: 'desc',
    };

    if (sortField && sortOrder) {
      orderBy = { [sortField]: sortOrder };
    }

    return this.prisma.studio.findMany({
      skip,
      take,
      orderBy,
    });
  }

  async createStudio(createStudioDto: CreateStudioDto): Promise<Studio> {
    const { name, description, logo } = createStudioDto;

    let logoPath = '';
    if (logo) {
      logoPath = await this.fileUtil.saveFile({
        file: logo,
        filename: `${name}_${Date.now()}`,
        folder: 'studios_logos',
      });
    }

    return this.prisma.studio.create({
      data: {
        name: name,
        description: description,
        logoPath: logoPath,
      },
    });
  }

  async updateStudio(updateStudioDto: UpdateStudioDto): Promise<Studio> {
    const { id, name, description, logo } = updateStudioDto;

    const existingStudio = await this.prisma.studio.findUnique({
      where: { id: id },
    });

    if (!existingStudio) {
      throw new Error('Studio not found');
    }

    let logoPath = existingStudio.logoPath;
    if (logo) {
      if (logoPath) {
        logoPath = await this.fileUtil.updateFile(
          logo,
          logoPath,
          `${name}_${Date.now()}`,
          'studios_logos',
        );
      } else {
        logoPath = await this.fileUtil.saveFile({
          file: logo,
          filename: `${name}_${Date.now()}`,
          folder: 'studios_logos',
        });
      }
    }

    return this.prisma.studio.update({
      where: { id },
      data: {
        name: name ?? existingStudio.name,
        description: description ?? existingStudio.description,
        logoPath: logoPath ?? existingStudio.logoPath,
      },
    });
  }

  async deleteStudio(id: number): Promise<Studio> {
    const existingStudio = await this.prisma.studio.findUnique({
      where: { id: id },
    });
    if (!existingStudio) {
      throw new Error('Studio not found');
    }

    if (existingStudio.logoPath) {
      await this.fileUtil.deleteFile(existingStudio.logoPath);
    }
    return this.prisma.studio.delete({ where: { id: id } });
  }
}
