import { DataSource, DeepPartial, QueryRunner, Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PaginationOptions, PaginationResult } from './pagination.interfaces';


interface HasId{
  id: number;
}
export abstract class AbstractCrudService<T extends HasId> {
  protected constructor(
    protected readonly repository: Repository<T>,
    protected readonly dataSource:DataSource,
  ) {}

  // Helper to create a QueryRunner for transactions
  private async runTransaction<R>(
    operation: (queryRunner: QueryRunner) => Promise<R>,
  ):Promise<R> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect();
    await queryRunner.startTransaction()

    try {
      const result = await operation(queryRunner);
      await queryRunner.commitTransaction()
      return result

    } catch (error) {

      const errorType = error as Error;

      await queryRunner.rollbackTransaction()

      // Wrap the original error in a generic message for the client
      throw new HttpException(
        process.env["NODE_ENV"] === 'production' ? 'Operation Failed' : errorType.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release()
    }
  }


  // Find one by ID with concurrency-safe locking
  async findOneByID(id: number): Promise<T | null> {
    return this.repository.findOne({
      where: {id: id} as never,
      lock: {mode:"pessimistic_read"} // For concurrency-safe reads
    })
  }


  // Find one by ID with concurrency-safe locking
  async findOneByEmail(email: string): Promise<T | null> {
    return this.runTransaction(async (queryRunner) => {
     return  queryRunner.manager.findOne(this.repository.target,{
        where: { email } as any,
        lock : {mode :"pessimistic_read"}
      })
    })

  }

 async findAll(paginationOption:PaginationOptions): Promise<PaginationResult<T>> {
    const { page, limit } = paginationOption

   // Calculate the offset (skip value)
    const skip = (page - 1) * limit

    const [data, total] = await this.repository.findAndCount({
     skip,
     take: limit,
   })

   return {
      data,
     total,
     page,
     limit,
   }
 }

  // Create a new entity with transaction support
  async create(data:DeepPartial<T>):Promise<T> {
    return this.runTransaction(async (queryRunner) => {
      const entity = this.repository.manager.create(
        this.repository.target,
        data
      )

      // validate the entity before saving

      return await queryRunner.manager.save(this.repository.target,entity)
    })
  }

  // Update an entity with optimistic concurrency control
  async update (id:number, data: DeepPartial<T>): Promise<T> {
    return this.runTransaction(async (queryRunner) => {
      const existing = await queryRunner.manager.findOne(this.repository.target,{
        where : {id} as never,
        //   lock: { mode: "optimistic" }, // TypeORM will use the version column automatically
      })

      if(!existing) {
        throw new HttpException(`Failed to update user with with ${id}`, HttpStatus.INTERNAL_SERVER_ERROR)
      }

      //  syntax is used to merge the current state of the entity with the new values you're updating
      //  to ensure that you don't unintentionally overwrite the entire entity.
      const updated = {...existing,...data}
      return await queryRunner.manager.save(this.repository.target,updated)
    })
  }

  // Delete an entity with transaction support
  async delete(id:number) {
    await this.runTransaction(async (queryRunner) => {
      const entity = await queryRunner.manager.findOne(this.repository.target,{
        where : {id} as never,
        lock : {mode: "pessimistic_write_or_fail"}
      })
      if(!entity){
        await queryRunner.rollbackTransaction();
        throw new HttpException( `Entity with ID ${id} not found.`,HttpStatus.NOT_FOUND);
      }

      // If entity exists, proceed with deletion
      await queryRunner.manager.remove(this.repository.target, entity);
    })

    return {
      date: new Date().toISOString(),
      success: true,
      message: `Entity with ID ${id} successfully deleted.`,
    }
  }

}
