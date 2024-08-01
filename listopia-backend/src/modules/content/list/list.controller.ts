import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/JWTGuard/jwt-auth.guard';
import type { UserPayload } from '@modules/auth/types/user-payload.type';
import type {
  ListBookMaxPagesType,
  ListItemCurrentType,
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
  Put,
  UseGuards,
} from '@nestjs/common';
import { ContentType, ListItemStatus } from '@prisma/client';
import { ListService } from './list.service';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @UseGuards(JwtAuthGuard)
  @Put(':contentType/:contentId/note')
  async UpdateNote(
    @Param('contentType') contentType: ContentType,
    @Param('contentId') contentId: number,
    @Body()
    data: Omit<ListItemNoteType, 'userId' | 'contentType' | 'contentId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.UpdateNote({
      ...data,
      userId,
      contentType,
      contentId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':contentType/:contentId/rating')
  async UpdateRating(
    @Param('contentType') contentType: ContentType,
    @Param('contentId') contentId: number,
    @Body()
    data: Omit<ListItemRatingType, 'userId' | 'contentType' | 'contentId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.UpdateRating({
      ...data,
      userId,
      contentType,
      contentId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':contentType/:contentId/review')
  async UpdateReview(
    @Param('contentType') contentType: ContentType,
    @Param('contentId') contentId: number,
    @Body()
    data: Omit<ListItemReviewType, 'userId' | 'contentType' | 'contentId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.UpdateReview({
      ...data,
      userId,
      contentType,
      contentId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':contentType/:contentId/current')
  async UpdateCurrent(
    @Param('contentType') contentType: ContentType,
    @Param('contentId') contentId: number,
    @Body()
    data: Omit<ListItemCurrentType, 'userId' | 'contentType' | 'contentId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.UpdateCurrent({
      ...data,
      userId,
      contentType,
      contentId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':contentType/:contentId/maxPages')
  async UpdateMaxPages(
    @Param('contentType') contentType: ContentType,
    @Param('contentId') contentId: number,
    @Body()
    data: Omit<ListBookMaxPagesType, 'userId' | 'contentType' | 'contentId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.UpdateMaxPages({
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
    @Param('status') status: ListItemStatus,
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
