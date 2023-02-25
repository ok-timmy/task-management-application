import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { TaskService } from './task/task.service';

@Module({
  imports: [TaskModule],
  providers: [TaskService],
})
export class AppModule {}
