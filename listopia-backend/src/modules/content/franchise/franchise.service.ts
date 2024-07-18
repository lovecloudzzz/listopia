import { FileUtil } from '@common/utils/file.util';
import type { CreateFranchiseType } from '@modules/content/franchise/types/createFranchise.type';
import type { GetFranchisesType } from '@modules/content/franchise/types/getFranchises.type';
import type { UpdateFranchiseType } from '@modules/content/franchise/types/updateFranchise.type';
import { Injectable } from '@nestjs/common';
import { Franchise, Prisma } from '@prisma/client';
import { PrismaService } from '@prismaPath/prisma.service';

@Injectable()
export class FranchiseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUtil: FileUtil,
  ) {}

  async getFranchise(id: number): Promise<Franchise> {
    const existingFranchise = await this.prisma.franchise.findUnique({
      where: { id: id },
    });

    if (!existingFranchise) {
      throw new Error('Franchise not found');
    }
    this.prisma.franchise.update({
      where: { id: id },
      data: { visitCount: existingFranchise.visitCount + 1 },
    });

    return this.prisma.franchise.findUnique({ where: { id } });
  }

  async getFranchises(
    getFranchisesDto: GetFranchisesType,
  ): Promise<Franchise[]> {
    const { page, pageSize, sortField, sortOrder } = getFranchisesDto;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let orderBy: Prisma.FranchiseOrderByWithRelationInput = {
      visitCount: 'desc',
    };

    if (sortField && sortOrder) {
      orderBy = { [sortField]: sortOrder };
    }

    return this.prisma.franchise.findMany({
      skip,
      take,
      orderBy,
    });
  }

  async createFranchise(
    createFranchiseDto: CreateFranchiseType,
  ): Promise<Franchise> {
    const { name, description, logo } = createFranchiseDto;

    let logoPath = '';
    if (logo) {
      logoPath = await this.fileUtil.saveFile({
        file: logo,
        filename: `${name}_${Date.now()}`,
        folder: 'franchises_logos',
      });
    }

    return this.prisma.franchise.create({
      data: {
        name: name,
        description: description,
        logoPath: logoPath,
      },
    });
  }

  async updateFranchise(
    updateFranchiseDto: UpdateFranchiseType,
  ): Promise<Franchise> {
    const { id, name, description, logo } = updateFranchiseDto;

    const existingFranchise = await this.prisma.franchise.findUnique({
      where: { id: id },
    });

    if (!existingFranchise) {
      throw new Error('Franchise not found');
    }

    let logoPath = existingFranchise.logoPath;
    if (logo) {
      if (logoPath) {
        logoPath = await this.fileUtil.updateFile(
          logo,
          logoPath,
          `${name}_${Date.now()}`,
          'franchises_logos',
        );
      } else {
        logoPath = await this.fileUtil.saveFile({
          file: logo,
          filename: `${name}_${Date.now()}`,
          folder: 'franchises_logos',
        });
      }
    }

    return this.prisma.franchise.update({
      where: { id },
      data: {
        name: name ?? existingFranchise.name,
        description: description ?? existingFranchise.description,
        logoPath: logoPath ?? existingFranchise.logoPath,
      },
    });
  }

  async deleteFranchise(id: number): Promise<Franchise> {
    const existingFranchise = await this.prisma.franchise.findUnique({
      where: { id: id },
    });

    if (!existingFranchise) {
      throw new Error('Franchise not found');
    }

    if (existingFranchise.logoPath) {
      await this.fileUtil.deleteFile(existingFranchise.logoPath);
    }

    return this.prisma.franchise.delete({ where: { id: id } });
  }
}
