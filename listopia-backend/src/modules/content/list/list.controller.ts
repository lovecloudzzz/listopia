import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/JWTGuard/jwt-auth.guard';
import { UserPayload } from '@modules/auth/types/user-payload.type';
import type {
  baseListItemType,
  ListItemNoteType,
  ListItemRatingType,
  ListItemReviewType,
  ListItemType,
} from '@modules/content/list/types/listItem.type';
import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { ListService } from './list.service';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @UseGuards(JwtAuthGuard)
  @Post('note')
  async addOrUpdateNote(
    @Body() data: Omit<ListItemNoteType, 'userId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.addOrUpdateNote({ ...data, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Post('rating')
  async addOrUpdateRating(
    @Body() data: Omit<ListItemRatingType, 'userId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.addOrUpdateRating({ ...data, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Post('review')
  async addOrUpdateReview(
    @Body() data: Omit<ListItemReviewType, 'userId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.addOrUpdateReview({ ...data, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Post('status')
  async addOrUpdateListItem(
    @Body() data: Omit<ListItemType, 'userId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.addOrUpdateListItem({ ...data, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('item')
  async deleteListItem(
    @Body() data: Omit<baseListItemType, 'userId'>,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.id;
    return this.listService.deleteListItem({ ...data, userId });
  }
}
