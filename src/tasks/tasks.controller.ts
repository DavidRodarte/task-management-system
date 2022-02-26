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
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter';
import { UpdateTaskStatusDto } from './dto/update-task-status-dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  public constructor(
    private tasksService: TasksService,
    private configService: ConfigService,
  ) {}

  @Get()
  public getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User ${user.username} retrieiving all tasks. Filters ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get(':id')
  public getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  public createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username} created a task. Data ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch(':id/status') public updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }

  @Delete(':id')
  public deleteTask(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }
  //@Get()
  //public getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
  //// If filters are defined, call getTasksWithFilters
  //// otherwhise, get all tasks
  //if (Object.keys(filterDto).length) {
  //return this.tasksService.getTasksWithFilters(filterDto);
  //}

  //return this.tasksService.getAllTasks();
  //}

  //@Get('/:id')
  //public getTaskById(@Param('id') id: string): Task {
  //return this.tasksService.getTaskById(id);
  //}

  //@Post()
  //public createTask(@Body() createTaskDto: CreateTaskDto): Task {
  //return this.tasksService.createTask(createTaskDto);
  //}

  //@Patch(':id/status') public updateTaskStatus(
  //@Param('id') id: string,
  //@Body() updateTaskStatusDto: UpdateTaskStatusDto,
  //): Task {
  //const { status } = updateTaskStatusDto;
  //return this.tasksService.updateTaskStatus(id, status);
  //}

  //@Delete(':id')
  //public deleteTask(@Param('id') id: string): void {
  //this.tasksService.deleteTask(id);
  //}
}
