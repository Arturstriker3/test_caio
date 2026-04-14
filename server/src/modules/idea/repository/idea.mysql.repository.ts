import { Inject, Injectable } from '@nestjs/common';
import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { v7 as uuidv7 } from 'uuid';
import { DATABASE_POOL } from '../../../common/database/database.config';
import type { PaginationQueryData } from '../../../common/pagination/dto/pagination-query.dto';
import { buildPaginatedResult, type PaginatedResult } from '../../../common/pagination/paginated-result';
import type { CreateIdeaRequestData } from '../dto/create-idea-request.dto';
import type { UpdateIdeaRequestData } from '../dto/update-idea-request.dto';
import { IdeaEntity } from '../idea.entity';
import type { IdeaRepository } from './idea.repository.interface';

interface IdeaRow extends RowDataPacket {
  id: string;
  whatCanBeImproved: string;
  currentProcess: string;
  improvedProcess: string;
  benefit: string;
  createdAt: string;
  updatedAt: string;
}

interface IdeaCountRow extends RowDataPacket {
  totalItems: number | string;
}

const IDEA_SELECT = `
  SELECT
    id,
    what_can_be_improved AS whatCanBeImproved,
    current_process AS currentProcess,
    improved_process AS improvedProcess,
    benefit,
    DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS createdAt,
    DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS updatedAt
  FROM ideas
`;

@Injectable()
export class IdeaMySqlRepository implements IdeaRepository {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async findAllPaginated(query: PaginationQueryData): Promise<PaginatedResult<IdeaEntity>> {
    const offset = (query.page - 1) * query.pageSize;
    const [rows] = await this.pool.query<IdeaRow[]>(`${IDEA_SELECT} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [
      query.pageSize,
      offset,
    ]);
    const [countRows] = await this.pool.query<IdeaCountRow[]>('SELECT COUNT(*) AS totalItems FROM ideas');
    const totalItems = Number(countRows[0]?.totalItems ?? 0);

    return buildPaginatedResult(
      rows.map((row) => this.toEntity(row)),
      totalItems,
      query,
    );
  }

  async findById(id: string): Promise<IdeaEntity | null> {
    const [rows] = await this.pool.query<IdeaRow[]>(`${IDEA_SELECT} WHERE id = ? LIMIT 1`, [id]);
    const row = rows[0];
    return row ? this.toEntity(row) : null;
  }

  async create(input: CreateIdeaRequestData): Promise<IdeaEntity> {
    const ideaId = uuidv7();

    await this.pool.execute<ResultSetHeader>(
      `
        INSERT INTO ideas (
          id,
          what_can_be_improved,
          current_process,
          improved_process,
          benefit,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP(3), UTC_TIMESTAMP(3))
      `,
      [ideaId, input.whatCanBeImproved, input.currentProcess, input.improvedProcess, input.benefit],
    );

    const createdIdea = await this.findById(ideaId);

    if (!createdIdea) {
      throw new Error('Failed to load created idea.');
    }

    return createdIdea;
  }

  async update(id: string, input: UpdateIdeaRequestData): Promise<IdeaEntity | null> {
    const fields: string[] = [];
    const values: string[] = [];

    if (input.whatCanBeImproved !== undefined) {
      fields.push('what_can_be_improved = ?');
      values.push(input.whatCanBeImproved);
    }

    if (input.currentProcess !== undefined) {
      fields.push('current_process = ?');
      values.push(input.currentProcess);
    }

    if (input.improvedProcess !== undefined) {
      fields.push('improved_process = ?');
      values.push(input.improvedProcess);
    }

    if (input.benefit !== undefined) {
      fields.push('benefit = ?');
      values.push(input.benefit);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push('updated_at = UTC_TIMESTAMP(3)');

    await this.pool.execute<ResultSetHeader>(`UPDATE ideas SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>('DELETE FROM ideas WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  private toEntity(row: IdeaRow): IdeaEntity {
    return new IdeaEntity(
      row.id,
      row.whatCanBeImproved,
      row.currentProcess,
      row.improvedProcess,
      row.benefit,
      row.createdAt,
      row.updatedAt,
    );
  }
}
