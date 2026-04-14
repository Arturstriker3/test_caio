import { NotFoundException } from '@nestjs/common';
import { IdeaEntity } from '../idea.entity';
import type { IdeaRepository } from '../repository/idea.repository.interface';
import { GetIdeaDetailsUseCase } from './get-idea-details.use-case';

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

describe('GetIdeaDetailsUseCase', () => {
  it('deve retornar ideia quando encontrada', async () => {
    const repository: jest.Mocked<IdeaRepository> = {
      findAllPaginated: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const useCase = new GetIdeaDetailsUseCase(repository);
    const idea = makeIdeaEntity();
    repository.findById.mockResolvedValue(idea);

    const result = await useCase.execute(idea.id);

    expect(repository.findById).toHaveBeenCalledWith(idea.id);
    expect(result).toBe(idea);
  });

  it('deve lançar NotFoundException quando não encontrar ideia', async () => {
    const repository: jest.Mocked<IdeaRepository> = {
      findAllPaginated: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const useCase = new GetIdeaDetailsUseCase(repository);
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('018f3222-08b0-7f0d-a730-6f4f6b28f641')).rejects.toThrow(NotFoundException);
  });
});
