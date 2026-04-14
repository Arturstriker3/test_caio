import { NotFoundException } from '@nestjs/common';
import type { IdeaRepository } from '../repository/idea.repository.interface';
import { DeleteIdeaUseCase } from './delete-idea.use-case';

describe('DeleteIdeaUseCase', () => {
  it('deve deletar ideia quando encontrada', async () => {
    const repository: jest.Mocked<IdeaRepository> = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const useCase = new DeleteIdeaUseCase(repository);
    repository.delete.mockResolvedValue(true);

    await expect(useCase.execute('018f3222-08b0-7f0d-a730-6f4f6b28f641')).resolves.toBeUndefined();

    expect(repository.delete).toHaveBeenCalledWith('018f3222-08b0-7f0d-a730-6f4f6b28f641');
  });

  it('deve lançar NotFoundException quando não encontrar ideia', async () => {
    const repository: jest.Mocked<IdeaRepository> = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const useCase = new DeleteIdeaUseCase(repository);
    repository.delete.mockResolvedValue(false);

    await expect(useCase.execute('018f3222-08b0-7f0d-a730-6f4f6b28f641')).rejects.toThrow(NotFoundException);
  });
});
