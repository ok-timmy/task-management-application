import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskModule } from './task.module';
import { TaskService } from './task.service';

const mockTaskRepository = () => {
  getTasks: jest.fn();
  getTasksById: jest.fn();
};

const mockUser = {
  username: 'Timmy1',
  password: '12345',
  id: 'someIds',
  tasks: [],
};

describe('Testing Task Service', () => {
  let taskService: TaskService;
  let taskRepository: Repository<Task>;

  beforeEach(async () => {
    //Initialize test module and services before executing any test case
    const module = await Test.createTestingModule({
      imports: [TaskModule],
      providers: [
        TaskService,
        { provide: Repository<Task>, useFactory: mockTaskRepository },
      ],
    }).compile();

    taskService = module.get(TaskService);
    taskRepository = module.get(Repository<Task>);
  });

  describe('Get Tasks', () => {
    it('calls taskService.getTask and returns the result', () => {
      expect(taskService.getTasks).not.toHaveBeenCalled();
      taskService.getTasks.mockResolvedValue('somevalue');
      const result = taskService.getTasks(null, mockUser);
      expect(taskService.getTasks(null, mockUser)).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('Get Tasks by Id', () => {
    it('Calls TaskServices.getTasksbyId and returns the result', () => {
      const mockTask = {
        id: 'someId',
        title: 'Random Title',
        description: '',
        status: TaskStatus.OPEN,
      };
      taskService.getTaskById.mockResolvedValue(mockTask);
      const result = taskService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('Calls TaskServices.getTasksbyId and handles an error', () => {
      taskService.getTaskById.mockResolvedValue(null);
      expect(taskService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
