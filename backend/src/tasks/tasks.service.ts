import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<TaskDocument> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      user: userId,
    });
    return createdTask.save();
  }

  async findAll(userId: string): Promise<TaskDocument[]> {
    return this.taskModel.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findOne({ _id: id, user: userId }).exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<TaskDocument> {
    const task = await this.taskModel
      .findOneAndUpdate(
        { _id: id, user: userId },
        { $set: updateTaskDto },
        { new: true },
      )
      .exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.taskModel.deleteOne({ _id: id, user: userId }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Task not found');
  }
}