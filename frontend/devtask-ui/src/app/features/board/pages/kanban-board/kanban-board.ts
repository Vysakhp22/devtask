import { Component, computed, inject, signal } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroPlus,
  heroMagnifyingGlass,
  heroFunnel,
} from '@ng-icons/heroicons/outline';
import { Task } from '@app/core/model/task.model';
import { KanbanColumn } from '../../components/kanban-column/kanban-column';
import { CountUp } from '@app/shared/directives/count-up';
import { NewTask } from '../new-task/new-task';

/** Static mock tasks — replace with httpResource() when the API is ready */
const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Set up Signal Forms for task creation', priority: 'high', status: 'todo', deadline: '2026-06-26', tags: ['angular', 'forms'] },
  { id: '2', title: 'Write unit tests with Vitest', priority: 'medium', status: 'todo', tags: ['testing'] },
  { id: '3', title: 'Configure GitHub Actions deploy pipeline', priority: 'low', status: 'todo', deadline: '2026-06-28', tags: ['devops'] },
  { id: '4', title: 'Build Kanban board with httpResource()', priority: 'high', status: 'inprogress', deadline: '2026-06-26', tags: ['angular', 'api'] },
  { id: '5', title: 'Spring Boot Task CRUD endpoints', priority: 'high', status: 'inprogress', tags: ['spring'] },
  { id: '6', title: 'Dockerize backend and test locally', priority: 'medium', status: 'inprogress', tags: ['docker'] },
  { id: '7', title: 'Sprint burndown with Angular Aria', priority: 'medium', status: 'inprogress', tags: ['a11y'] },
  { id: '8', title: 'Create Angular 22 project with CLI', priority: 'low', status: 'done', tags: ['angular'] },
  { id: '9', title: 'Task entity and JPA repository', priority: 'medium', status: 'done', tags: ['spring'] },
  { id: '10', title: 'debounced() search bar', priority: 'low', status: 'done', tags: ['angular'] },
  { id: '11', title: 'H2 in-memory database setup', priority: 'low', status: 'done', tags: ['spring'] },
  { id: '12', title: 'GitHub repo and branch structure', priority: 'low', status: 'done', tags: ['devops'] },
];

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.scss',
  imports: [KanbanColumn, NgIconComponent, CountUp],
  viewProviders: [provideIcons({ heroPlus, heroMagnifyingGlass, heroFunnel })],
})
export class KanbanBoard {
  private readonly dialog = inject(Dialog);

  /** Loading flag — set to true while httpResource() is pending */
  protected readonly isLoading = signal(false);

  /** All tasks — will come from httpResource() in the real implementation */
  private readonly allTasks = signal<Task[]>(MOCK_TASKS);

  /** Current search query, debounced in the template */
  protected readonly searchQuery = signal('');

  /** Tasks filtered by the search query */
  private readonly filteredTasks = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allTasks();
    return this.allTasks().filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(q)),
    );
  });

  // ── Columns ─────────────────────────────────────────────────────────────────
  protected readonly todoTasks = computed(() =>
    this.filteredTasks().filter((t) => t.status === 'todo'),
  );

  protected readonly inProgressTasks = computed(() =>
    this.filteredTasks().filter((t) => t.status === 'inprogress'),
  );

  protected readonly doneTasks = computed(() =>
    this.filteredTasks().filter((t) => t.status === 'done'),
  );

  // ── Sprint stats ─────────────────────────────────────────────────────────────
  protected readonly totalCount = computed(() => this.allTasks().length);
  protected readonly inProgressCount = computed(() => this.inProgressTasks().length);
  protected readonly doneCount = computed(() => this.doneTasks().length);
  protected readonly sprintProgress = computed(() =>
    Math.round((this.doneCount() / this.totalCount()) * 100),
  );

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  protected openNewTask(): void {
    this.dialog.open(NewTask, {
      width: '560px',
      maxWidth: '95vw',
      backdropClass: 'task-dialog-backdrop',
      disableClose: true,
    });
  }
}
