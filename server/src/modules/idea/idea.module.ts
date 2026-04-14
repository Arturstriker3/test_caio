import { Module } from '@nestjs/common';
import { IdeaController } from './idea.controller';
import { IdeaMySqlRepository } from './repository/idea.mysql.repository';
import { IDEA_REPOSITORY } from './repository/idea.repository.interface';
import { CreateIdeaUseCase } from './use-cases/create-idea.use-case';
import { DeleteIdeaUseCase } from './use-cases/delete-idea.use-case';
import { GetIdeaDetailsUseCase } from './use-cases/get-idea-details.use-case';
import { ListIdeasUseCase } from './use-cases/list-ideas.use-case';
import { UpdateIdeaUseCase } from './use-cases/update-idea.use-case';

@Module({
  controllers: [IdeaController],
  providers: [
    {
      provide: IDEA_REPOSITORY,
      useClass: IdeaMySqlRepository,
    },
    ListIdeasUseCase,
    GetIdeaDetailsUseCase,
    CreateIdeaUseCase,
    UpdateIdeaUseCase,
    DeleteIdeaUseCase,
  ],
})
export class IdeaModule {}
