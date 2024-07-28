import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prismaPath/prisma.service';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}
}
