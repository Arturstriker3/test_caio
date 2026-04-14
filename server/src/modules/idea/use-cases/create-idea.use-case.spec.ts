import type { CreateIdeaRequestData } from '../dto/create-idea-request.dto';
import { IdeaEntity } from '../idea.entity';
import type { IdeaRepository } from '../repository/idea.repository.interface';
import { CreateIdeaUseCase } from './create-idea.use-case';

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

describe('CreateIdeaUseCase', () => {
  it('deve criar ideia via repositório', async () => {
    const repository: jest.Mocked<IdeaRepository> = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const useCase = new CreateIdeaUseCase(repository);
    const input: CreateIdeaRequestData = {
      whatCanBeImproved: 'Melhorar deploy',
      currentProcess: 'Deploy manual',
      improvedProcess: 'Deploy automatizado',
      benefit: 'Menos falhas',
    };
    const created = makeIdeaEntity();
    repository.create.mockResolvedValue(created);

    const result = await useCase.execute(input);

    expect(repository.create).toHaveBeenCalledWith(input);
    expect(result).toBe(created);
  });
});
