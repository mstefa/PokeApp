import { TypeRepository } from '../../domain/ports/TypeRepository';

/**
 * Use Case: Get Types
 * Retrieves all Pokemon types from the repository
 */
export class TypesFetcher {
  private repository: TypeRepository;

  constructor(repository: TypeRepository) {
    this.repository = repository;
  }

  async run(): Promise<Array<{ id?: number; name: string }>> {
    try {
      const types = await this.repository.findAll();
      return types.map(type => type.toPrimitives());
    } catch (error) {
      throw new Error(`Failed to fetch types: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
