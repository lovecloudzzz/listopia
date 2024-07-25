import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/JWTGuard/jwt-auth.guard';
import type { UserPayload } from '@modules/auth/types/user-payload.type';
import type {
  ListItemNoteType,
  ListItemRatingType,
  ListItemReviewType,
  ListItemType,
} from '@modules/content/list/types/listItem.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  BookStatus,
  ContentType,
  GameStatus,
  MovieStatus,
} from '@prisma/client';
import { ListService } from './list.service';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':contentType/:contentId/note')
  async addOrUpdateNote(
    @Param('contentType') contentType: ContentType,
    @Param('contentId') contentId: number,
    @Body()
    data: Omit<ListItemNoteType, 'userId' | 'contentType' | 'contentId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.addOrUpdateNote({
      ...data,
      userId,
      contentType,
      contentId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':contentType/:contentId/rating')
  async addOrUpdateRating(
    @Param('contentType') contentType: ContentType,
    @Param('contentId') contentId: number,
    @Body()
    data: Omit<ListItemRatingType, 'userId' | 'contentType' | 'contentId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.addOrUpdateRating({
      ...data,
      userId,
      contentType,
      contentId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':contentType/:contentId/review')
  async addOrUpdateReview(
    @Param('contentType') contentType: ContentType,
    @Param('contentId') contentId: number,
    @Body()
    data: Omit<ListItemReviewType, 'userId' | 'contentType' | 'contentId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.addOrUpdateReview({
      ...data,
      userId,
      contentType,
      contentId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':contentType/:contentId')
  async addOrUpdateListItem(
    @Param('contentType') contentType: ContentType,
    @Param('contentId') contentId: number,
    @Body() data: Omit<ListItemType, 'userId' | 'contentType' | 'contentId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.addOrUpdateListItem({
      ...data,
      userId,
      contentType,
      contentId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':contentType/:contentId')
  async deleteListItem(
    @Param('contentType') contentType: ContentType,
    @Param('contentId') contentId: number,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.deleteListItem({ userId, contentType, contentId });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllListItems(@CurrentUser() user: UserPayload) {
    const userId = user.id;
    return this.listService.getAllListItemsByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':contentType/:status')
  async getListItemsByTypeAndStatus(
    @Param('contentType') contentType: ContentType,
    @Param('status') status: BookStatus | MovieStatus | GameStatus,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.getListItemsByTypeAndStatus({
      userId,
      contentType,
      status,
    });
  }
}
