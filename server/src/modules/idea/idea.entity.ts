export class IdeaEntity {
  constructor(
    public readonly id: string,
    public readonly whatCanBeImproved: string,
    public readonly currentProcess: string,
    public readonly improvedProcess: string,
    public readonly benefit: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}
}
