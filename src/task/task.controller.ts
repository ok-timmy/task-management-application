import { CreateTaskDto } from './dto/create-task.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { TaskService } from './task.service';
import { GetTaskFilterDto } from './dto/get-task-filter-dto';
import { UpdateTaskStatus } from './dto/update-task-status-dto';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  //If we have search with filter provided, getTaskWithFilters will be called, otherwise, getAllTasks will be called
  @Get()
  getTask(@Query() filterDto: GetTaskFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this.taskService.getTasksWithFilterDto(filterDto);
    } else {
      return this.taskService.getAllTasks();
    }
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string): Task[] {
    return this.taskService.deleteTask(id);
  }

  @Patch(':id/status')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatus,
  ): Task {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTask(id, status);
  }
}
