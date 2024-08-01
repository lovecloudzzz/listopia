import { FileUtil } from '@common/utils/file.util';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [FileUtil],
  exports: [FileUtil],
})
export class UtilsModule {}
