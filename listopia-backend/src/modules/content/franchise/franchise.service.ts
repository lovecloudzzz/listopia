import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prismaPath/prisma.service';
import { FileUtil } from '@common/utils/file.util';
import { Franchise, Prisma } from '@prisma/client';
import { GetFranchisesDto } from '@modules/content/franchise/dto/getFranchises.dto';
import { CreateFranchiseDto } from '@modules/content/franchise/dto/createFranchise.dto';
import { UpdateFranchiseDto } from '@modules/content/franchise/dto/updateFranchiseDto';

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
    getFranchisesDto: GetFranchisesDto,
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
    createFranchiseDto: CreateFranchiseDto,
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
    updateFranchiseDto: UpdateFranchiseDto,
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
