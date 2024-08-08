import { FileUtil } from '@common/utils/file.util';
import type { CreatePlatformType } from '@modules/content/platform/types/createPlatform.type';
import type { GetPlatformsType } from '@modules/content/platform/types/getPlatforms.type';
import type { UpdatePlatformType } from '@modules/content/platform/types/updatePlatform.type';
import { Injectable } from '@nestjs/common';
import { Platform, Prisma } from '@prisma/client';
import { PrismaService } from '@prismaPath/prisma.service';

@Injectable()
export class PlatformService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUtil: FileUtil,
  ) {}

  async getPlatform(id: number): Promise<Platform> {
    const existingPlatform = await this.prisma.platform.findUnique({
      where: { id: id },
    });

    if (!existingPlatform) {
      throw new Error('Platform not found');
    }

    return this.prisma.platform.findUnique({ where: { id } });
  }

  async getPlatforms(getPlatformsData: GetPlatformsType): Promise<Platform[]> {
    const { page, pageSize, sortField, sortOrder } = getPlatformsData;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let orderBy: Prisma.PlatformOrderByWithRelationInput = {
      visitCount: 'desc',
    };

    if (sortField && sortOrder) {
      orderBy = { [sortField]: sortOrder };
    }

    return this.prisma.platform.findMany({
      skip,
      take,
      orderBy,
    });
  }

  async createPlatform(
    createPlatformData: CreatePlatformType,
  ): Promise<Platform> {
    const { name, description, logo } = createPlatformData;

    let logoPath = '';
    if (logo) {
      logoPath = await this.fileUtil.saveFile({
        file: logo,
        filename: `${name}_${Date.now()}`,
        folder: 'platforms_logos',
      });
    }

    return this.prisma.platform.create({
      data: {
        name: name,
        description: description,
        logoPath: logoPath,
      },
    });
  }

  async updatePlatform(
    updatePlatformData: UpdatePlatformType,
  ): Promise<Platform> {
    const { id, name, description, logo } = updatePlatformData;

    const existingPlatform = await this.prisma.platform.findUnique({
      where: { id: id },
    });

    if (!existingPlatform) {
      throw new Error('Platform not found');
    }

    let logoPath = existingPlatform.logoPath;
    if (logo) {
      if (logoPath) {
        logoPath = await this.fileUtil.updateFile(
          logo,
          logoPath,
          `${name}_${Date.now()}`,
          'platforms_logos',
        );
      } else {
        logoPath = await this.fileUtil.saveFile({
          file: logo,
          filename: `${name}_${Date.now()}`,
          folder: 'platforms_logos',
        });
      }
    }

    return this.prisma.platform.update({
      where: { id },
      data: {
        name: name ?? existingPlatform.name,
        description: description ?? existingPlatform.description,
        logoPath: logoPath ?? existingPlatform.logoPath,
      },
    });
  }

  async deletePlatform(id: number): Promise<Platform> {
    const existingPlatform = await this.prisma.platform.findUnique({
      where: { id: id },
    });
    if (!existingPlatform) {
      throw new Error('Platform not found');
    }

    if (existingPlatform.logoPath) {
      await this.fileUtil.deleteFile(existingPlatform.logoPath);
    }
    return this.prisma.platform.delete({ where: { id: id } });
  }
}
