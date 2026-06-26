import { Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlus, heroExclamationTriangle } from '@ng-icons/heroicons/outline';
import { Task, TaskStatus } from '@app/core/model/task.model';
import { TaskCard } from '../task-card/task-card';

@Component({
  selector: 'app-kanban-column',
  templateUrl: './kanban-column.html',
  styleUrl: './kanban-column.scss',
  viewProviders: [provideIcons({ heroPlus, heroExclamationTriangle })],
  imports: [TaskCard, NgIconComponent],
})
export class KanbanColumn {
  readonly title = input.required<string>();
  readonly status = input.required<TaskStatus>();
  readonly tasks = input<Task[]>([]);
  readonly isLoading = input<boolean>(false);

  /** Skeleton placeholder items for loading state */
  protected readonly skeletonItems = [1, 2];
}
