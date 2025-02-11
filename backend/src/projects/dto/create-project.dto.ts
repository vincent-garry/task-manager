export class CreateProjectDto {
    name: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    status?: 'active' | 'completed' | 'on_hold';
    startDate?: Date;
    dueDate?: Date;
  }