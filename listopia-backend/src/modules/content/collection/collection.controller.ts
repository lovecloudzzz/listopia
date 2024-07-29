import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/JWTGuard/jwt-auth.guard';
import type { UserPayload } from '@modules/auth/types/user-payload.type';
import {
  CollectionType,
  CollectionUpdateType,
} from '@modules/content/collection/types/collection.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ContentType } from '@prisma/client';
import { CollectionService } from './collection.service';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get(':id')
  async getCollection(@Param('id') id: number) {
    return this.collectionService.getCollection(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCollection(
    @Body() data: CollectionType,
    @CurrentUser() user: UserPayload,
  ) {
    return this.collectionService.createCollection({
      ...data,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCollection(
    @Param('id') collectionId: number,
    @Body() data: CollectionUpdateType,
    @CurrentUser() user: UserPayload,
  ) {
    return this.collectionService.updateCollection({
      ...data,
      collectionId,
      userId: user.id,
    });
  }

  @Get('user/:userId')
  async getCollectionsByUserId(@Param('userId') userId: number) {
    return this.collectionService.getCollectionsByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCollection(
    @Param('id') collectionId: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.collectionService.deleteCollection({
      collectionId,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/:contentType/:contentId')
  async addItemToCollection(
    @Param('id') collectionId: number,
    @Param('contentType') contentType: ContentType,
    @Param('contentId') contentId: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.collectionService.addItemToCollection({
      collectionId,
      contentType,
      contentId,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/:contentType/:contentId')
  async deleteItemFromCollection(
    @Param('id') collectionId: number,
    @Param('contentType') contentType: ContentType,
    @Param('contentId') contentId: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.collectionService.deleteItemFromCollection({
      collectionId,
      contentType,
      contentId,
      userId: user.id,
    });
  }
}
