import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  public constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  public getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  public async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return found;
  }

  public createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  public async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    await this.tasksRepository.save(task);

    return task;
  }

  public async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
  //Working with local memory
  //private tasks: Task[] = [];
  //public getAllTasks(): Task[] {
  //return this.tasks;
  //}
  //public getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //const { status, search } = filterDto;
  //let tasks = this.getAllTasks();
  //// Status
  //if (status) {
  //tasks = tasks.filter((task) => task.status === status);
  //}
  //// Search
  //if (search) {
  //tasks = tasks.filter((task) => {
  //if (task.title.includes(search) || task.description.includes(search)) {
  //return true;
  //}
  //return false;
  //});
  //}
  //return tasks;
  //}
  //public getTaskById(id: string): Task {
  //// try to get task, if not found throw 404
  //// otherwhise, return the found task
  //const task = this.tasks.find((task) => task.id === id);
  //if (!task) {
  //throw new NotFoundException(`Task with id ${id} not found`);
  //}
  //return task;
  //}
  //public createTask(createTaskDto: CreateTaskDto): Task {
  //const { title, description } = createTaskDto;
  //const task: Task = {
  //id: uuid(),
  //title,
  //description,
  //status: TaskStatus.OPEN,
  //};
  //this.tasks.push(task);
  //return task;
  //}
  //public updateTaskStatus(id: string, status: TaskStatus): Task {
  //const task = this.getTaskById(id);
  //task.status = status;
  //return task;
  //}
  //public deleteTask(id: string): void {
  //const found = this.getTaskById(id);
  //this.tasks.splice(
  //this.tasks.findIndex((task) => {
  //return task.id === found.id;
  //}),
  //);
  //}
}
