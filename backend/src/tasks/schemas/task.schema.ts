import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo',
  })
  status: string;

  @Prop({
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  })
  priority: string;

  @Prop()
  dueDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);