// import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';

// @EntityRepository(Task)
// @Injectable()
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<boolean> {
    await this.delete(id);
    return true;
  }

  async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    const { status, search } = filterDto;

    //do something with status
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    //do something with search
    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const task = query.getMany();
    return task;
  }
}
