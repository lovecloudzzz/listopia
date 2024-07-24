import { CollectionService } from '@modules/content/collection/collection.service';
import { Controller } from '@nestjs/common';

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}
}
