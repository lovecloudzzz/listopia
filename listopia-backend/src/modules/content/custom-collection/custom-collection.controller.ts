import { Controller } from '@nestjs/common';
import { CustomCollectionService } from './custom-collection.service';

@Controller('custom-collection')
export class CustomCollectionController {
  constructor(
    private readonly customCollectionService: CustomCollectionService,
  ) {}
}
