import { Controller } from '@nestjs/common';
import { CastService } from './cast.service';

@Controller('cast')
export class CastController {
  constructor(private readonly castService: CastService) {}
}
