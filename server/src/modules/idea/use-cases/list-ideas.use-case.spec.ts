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
  it('deve listar ideias via repositório', async () => {
    const repository: jest.Mocked<IdeaRepository> = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const useCase = new ListIdeasUseCase(repository);
    const ideas = [makeIdeaEntity('018f3222-08b0-7f0d-a730-6f4f6b28f641'), makeIdeaEntity('018f3222-08b0-7f0d-a730-6f4f6b28f642')];
    repository.findAll.mockResolvedValue(ideas);

    const result = await useCase.execute();

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(ideas);
  });
});
