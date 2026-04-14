import { PaginationQueryDto } from '../../common/pagination/dto/pagination-query.dto';
import { IdeaIdParamDto } from './dto/idea-id-param.dto';
import { ListIdeasResponseDto } from './dto/list-ideas-response.dto';
import { IdeaResponseDto } from './dto/idea-response.dto';
import { UpdateIdeaRequestDto } from './dto/update-idea-request.dto';
import { CreateIdeaRequestDto } from './dto/create-idea-request.dto';
import { IdeaController } from './idea.controller';
import { IdeaEntity } from './idea.entity';
import { CreateIdeaUseCase } from './use-cases/create-idea.use-case';
import { DeleteIdeaUseCase } from './use-cases/delete-idea.use-case';
import { GetIdeaDetailsUseCase } from './use-cases/get-idea-details.use-case';
import { ListIdeasUseCase } from './use-cases/list-ideas.use-case';
import { UpdateIdeaUseCase } from './use-cases/update-idea.use-case';

function makeIdeaEntity(): IdeaEntity {
  return new IdeaEntity(
    '018f3222-08b0-7f0d-a730-6f4f6b28f641',
    'Melhorar deploy',
    'Deploy manual',
    'Deploy automatizado',
    'Menos falhas',
    '2026-04-14T19:08:12.000Z',
    '2026-04-14T19:30:48.000Z',
  );
}

describe('IdeaController', () => {
  let controller: IdeaController;
  let listIdeasUseCase: { execute: jest.Mock };
  let getIdeaDetailsUseCase: { execute: jest.Mock };
  let createIdeaUseCase: { execute: jest.Mock };
  let updateIdeaUseCase: { execute: jest.Mock };
  let deleteIdeaUseCase: { execute: jest.Mock };

  beforeEach(() => {
    listIdeasUseCase = { execute: jest.fn() };
    getIdeaDetailsUseCase = { execute: jest.fn() };
    createIdeaUseCase = { execute: jest.fn() };
    updateIdeaUseCase = { execute: jest.fn() };
    deleteIdeaUseCase = { execute: jest.fn() };

    controller = new IdeaController(
      listIdeasUseCase as unknown as ListIdeasUseCase,
      getIdeaDetailsUseCase as unknown as GetIdeaDetailsUseCase,
      createIdeaUseCase as unknown as CreateIdeaUseCase,
      updateIdeaUseCase as unknown as UpdateIdeaUseCase,
      deleteIdeaUseCase as unknown as DeleteIdeaUseCase,
    );
  });

  it('deve listar ideias com metadados de paginação', async () => {
    const idea = makeIdeaEntity();
    const query: PaginationQueryDto = { page: 1, pageSize: 10 };
    const paginatedResult = {
      items: [idea],
      meta: {
        page: 1,
        pageSize: 10,
        totalItems: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
    listIdeasUseCase.execute.mockResolvedValue(paginatedResult);

    const result = await controller.listIdeas(query);

    expect(listIdeasUseCase.execute).toHaveBeenCalledWith(query);
    expect(result).toEqual(ListIdeasResponseDto.fromPaginatedEntities(paginatedResult));
  });

  it('deve buscar ideia por id e retornar IdeaResponseDto', async () => {
    const idea = makeIdeaEntity();
    const params: IdeaIdParamDto = { id: idea.id };
    getIdeaDetailsUseCase.execute.mockResolvedValue(idea);

    const result = await controller.getIdeaById(params);

    expect(getIdeaDetailsUseCase.execute).toHaveBeenCalledWith(idea.id);
    expect(result).toEqual(IdeaResponseDto.fromEntity(idea));
  });

  it('deve criar ideia e retornar IdeaResponseDto', async () => {
    const created = makeIdeaEntity();
    const body: CreateIdeaRequestDto = {
      whatCanBeImproved: 'Melhorar deploy',
      currentProcess: 'Deploy manual',
      improvedProcess: 'Deploy automatizado',
      benefit: 'Menos falhas',
    } as CreateIdeaRequestDto;
    createIdeaUseCase.execute.mockResolvedValue(created);

    const result = await controller.createIdea(body);

    expect(createIdeaUseCase.execute).toHaveBeenCalledWith(body);
    expect(result).toEqual(IdeaResponseDto.fromEntity(created));
  });

  it('deve atualizar ideia e retornar IdeaResponseDto', async () => {
    const updated = makeIdeaEntity();
    const params: IdeaIdParamDto = { id: updated.id };
    const body: UpdateIdeaRequestDto = {
      benefit: 'Menos falhas e mais velocidade',
    } as UpdateIdeaRequestDto;
    updateIdeaUseCase.execute.mockResolvedValue(updated);

    const result = await controller.updateIdea(params, body);

    expect(updateIdeaUseCase.execute).toHaveBeenCalledWith(updated.id, body);
    expect(result).toEqual(IdeaResponseDto.fromEntity(updated));
  });

  it('deve deletar ideia', async () => {
    const params: IdeaIdParamDto = { id: '018f3222-08b0-7f0d-a730-6f4f6b28f641' };

    await controller.deleteIdea(params);

    expect(deleteIdeaUseCase.execute).toHaveBeenCalledWith(params.id);
  });
});
