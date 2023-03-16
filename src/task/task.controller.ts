import { CreateTaskDto } from './dto/create-task.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';
import { UpdateTaskStatus } from './dto/update-task-status-dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/dto/get-user.decorator';
import { User } from '../auth/user.entity';
import { ConfigService } from '@nestjs/config';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
  private logger = new Logger('TaskController');
  constructor(
    private taskService: TaskService,
    private configService: ConfigService,
  ) {
    console.log(configService.get('TEST_VALUE'));
  }

  //If we have search with filter provided, getTaskWithFilters will be called, otherwise, getAllTasks will be called
  @Get()
  getTask(
    @Query() filterDto: GetTaskFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${
        user.username
      }" is receiving all tasks with the filter ${JSON.stringify(filterDto)}`,
    );
    return this.taskService.getTasks(filterDto, user);
  }

  @Get(':id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" is receiving task with id ${id}`,
    );
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" is creating Task with details ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<boolean> {
    this.logger.verbose(
      `User "${user.username}" is deleting task with id ${id}`,
    );
    return this.taskService.deleteTask(id, user);
  }

  @Patch(':id/status')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTask(id, status, user);
  }
}
