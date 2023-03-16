import { Task } from '../task/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  //
  @OneToMany((type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}
