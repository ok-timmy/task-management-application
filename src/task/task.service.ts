import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class TaskService {
  private logger = new Logger('TaskServices');
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });
    const { status, search } = filterDto;

    //do something with status
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    //do something with search
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const task = query.getMany();
      return task;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user ${
          user.username
        } for filters ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.taskRepository.save(task);
    return task;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id: id,
        user,
      },
    });

    if (!found) {
      throw new NotFoundException(`Task with ${id} not found`);
    }

    return found;
  }

  async deleteTask(id: string, user: User): Promise<boolean> {
    const found = this.getTaskById(id, user);
    if (found) {
      await this.taskRepository.delete({ id, user });
      return true;
    }
  }

  async updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
