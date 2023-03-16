import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskModule } from './task.module';
import { TaskService } from './task.service';

const mockTaskRepository = () => {
  getTasks: jest.fn();
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
});
