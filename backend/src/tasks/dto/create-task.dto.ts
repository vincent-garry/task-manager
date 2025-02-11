export class CreateTaskDto {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    startDate?: Date;
    dueDate?: Date
    estimatedTime?: number;
}