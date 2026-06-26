import { TitleCasePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroClock, heroTag } from '@ng-icons/heroicons/outline';
import { Task } from '@app/core/model/task.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
  imports: [NgIconComponent, TitleCasePipe],
  viewProviders: [provideIcons({ heroClock, heroTag })],
})
export class TaskCard {
  readonly task = input.required<Task>();

  /** Returns true when deadline is today or in the past */
  protected readonly isDeadlineOverdue = computed(() => {
    const deadline = this.task().deadline;
    if (!deadline) return false;
    return new Date(deadline) <= new Date();
  });

  /** Formats a date string to "Jun 28" style */
  protected formatDeadline(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  /** Returns at most 3 visible tags */
  protected readonly visibleTags = computed(() => {
    const tags = this.task().tags ?? [];
    return tags.slice(0, 3);
  });

  /** Extra tag count beyond the first 3 */
  protected readonly extraTagCount = computed(() => {
    const tags = this.task().tags ?? [];
    return Math.max(0, tags.length - 3);
  });
}
