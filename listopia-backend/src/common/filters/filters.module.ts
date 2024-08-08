import { HttpExceptionFilter } from '@common/filters/http-exception/http-exception.filter';
import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Global()
@Module({
  providers: [
    HttpExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [HttpExceptionFilter],
})
export class FiltersModule {}
