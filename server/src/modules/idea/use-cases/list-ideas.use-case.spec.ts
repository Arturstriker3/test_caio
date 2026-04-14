import { IdeaEntity } from '../idea.entity';
import type { IdeaRepository } from '../repository/idea.repository.interface';
import { ListIdeasUseCase } from './list-ideas.use-case';

function makeIdeaEntity(id: string): IdeaEntity {
  return new IdeaEntity(
    id,
    'Melhorar deploy',
    'Deploy manual',
    'Deploy automatizado',
    'Menos falhas',
    '2026-04-14T19:08:12.000Z',
    '2026-04-14T19:30:48.000Z',
  );
}

describe('ListIdeasUseCase', () => {
  it('deve listar ideias paginadas via repositório', async () => {
    const repository: jest.Mocked<IdeaRepository> = {
      findAllPaginated: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const useCase = new ListIdeasUseCase(repository);
    const query = { page: 1, pageSize: 10 };
    const ideas = [makeIdeaEntity('018f3222-08b0-7f0d-a730-6f4f6b28f641'), makeIdeaEntity('018f3222-08b0-7f0d-a730-6f4f6b28f642')];
    const paginatedResult = {
      items: ideas,
      meta: {
        page: 1,
        pageSize: 10,
        totalItems: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
    repository.findAllPaginated.mockResolvedValue(paginatedResult);

    const result = await useCase.execute(query);

    expect(repository.findAllPaginated).toHaveBeenCalledWith(query);
    expect(result).toEqual(paginatedResult);
  });
});
