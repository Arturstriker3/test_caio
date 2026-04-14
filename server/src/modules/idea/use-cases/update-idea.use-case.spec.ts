import { NotFoundException } from '@nestjs/common';
import type { UpdateIdeaRequestData } from '../dto/update-idea-request.dto';
import { IdeaEntity } from '../idea.entity';
import type { IdeaRepository } from '../repository/idea.repository.interface';
import { UpdateIdeaUseCase } from './update-idea.use-case';

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

describe('UpdateIdeaUseCase', () => {
  it('deve atualizar ideia quando encontrada', async () => {
    const repository: jest.Mocked<IdeaRepository> = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const useCase = new UpdateIdeaUseCase(repository);
    const updated = makeIdeaEntity();
    const input: UpdateIdeaRequestData = { benefit: 'Menos falhas e mais velocidade' };
    repository.update.mockResolvedValue(updated);

    const result = await useCase.execute(updated.id, input);

    expect(repository.update).toHaveBeenCalledWith(updated.id, input);
    expect(result).toBe(updated);
  });

  it('deve lançar NotFoundException quando não encontrar ideia', async () => {
    const repository: jest.Mocked<IdeaRepository> = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const useCase = new UpdateIdeaUseCase(repository);
    repository.update.mockResolvedValue(null);

    await expect(useCase.execute('018f3222-08b0-7f0d-a730-6f4f6b28f641', { benefit: 'x' })).rejects.toThrow(NotFoundException);
  });
});
