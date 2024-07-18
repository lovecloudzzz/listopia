import { Module } from '@nestjs/common';
import { GenreModule } from './genre/genre.module';
import { ThemeModule } from './theme/theme.module';
import { PersonModule } from './person/person.module';
import { CharacterModule } from './character/character.module';
import { DeveloperModule } from './developer/developer.module';
import { PublisherModule } from './publisher/publisher.module';
import { CastModule } from './cast/cast.module';
import { StudioModule } from './studio/studio.module';
import { PlatformModule } from './platform/platform.module';
import { FranchiseModule } from './franchise/franchise.module';
import { BookModule } from './book/book.module';
import { GameModule } from './game/game.module';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [
    GenreModule,
    ThemeModule,
    PersonModule,
    CharacterModule,
    DeveloperModule,
    PublisherModule,
    CastModule,
    StudioModule,
    PlatformModule,
    FranchiseModule,
    BookModule,
    GameModule,
    MovieModule,
  ],
})
export class ContentModule {}
