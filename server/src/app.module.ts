import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './common/config/config.module';
import { DatabaseModule } from './common/database/database.module';
import { IdeaModule } from './modules/idea/idea.module';

@Module({
  imports: [ConfigModule, DatabaseModule, IdeaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
