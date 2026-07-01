import { Component, computed, inject, signal, DestroyRef } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormField, FormRoot, form, maxLength, minLength, required } from '@angular/forms/signals';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import type { Priority } from '@app/core/model/task.model';

interface INewTaskModel {
  title: string;
  description: string;
  deadline: string;
}

type TaskType = 'task' | 'sprint';

@Component({
  selector: 'app-new-task',
  imports: [FormRoot, FormField, NgIconComponent],
  templateUrl: './new-task.html',
  styleUrl: './new-task.scss',
  viewProviders: [provideIcons({ heroXMark })],
})
export class NewTask {
  private readonly dialogRef = inject(DialogRef<void>, { optional: true });
  private readonly destroyRef = inject(DestroyRef);

  // ── Segmented controls ─────────────────────────────────────────────────────
  protected readonly selectedPriority = signal<Priority>('medium');
  protected readonly selectedType = signal<TaskType>('task');

  // ── Tags ───────────────────────────────────────────────────────────────────
  protected readonly tags = signal<string[]>([]);
  protected readonly tagInputValue = signal('');
  protected readonly MAX_TAGS = 5;

  // ── UI state ───────────────────────────────────────────────────────────────
  protected readonly showDirtyGuard = signal(false);
  protected readonly submitError = signal(false);
  protected readonly submitSuccess = signal(false);
  protected readonly deadlineError = signal('');

  // ── Form ───────────────────────────────────────────────────────────────────
  private readonly formModel = signal<INewTaskModel>({ title: '', description: '', deadline: '' });

  protected readonly taskForm = form(
    this.formModel,
    (path) => {
      required(path.title, { message: 'Title is required' });
      minLength(path.title, 3, { message: 'Title must be at least 3 characters' });
      maxLength(path.title, 120, { message: 'Title must be at most 120 characters' });
    },
    {
      submission: {
        action: async (field) => {
          const values = field().value();

          if (this.selectedType() === 'sprint') {
            if (!values.deadline) {
              this.deadlineError.set('Deadline is required for sprint tasks');
              return;
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (new Date(values.deadline) < today) {
              this.deadlineError.set('Deadline cannot be in the past');
              return;
            }
          }

          this.deadlineError.set('');
          this.submitError.set(false);

          try {
            // TODO: replace with real POST /api/tasks
            await new Promise<void>((resolve) => setTimeout(resolve, 1200));
            this.submitSuccess.set(true);
            setTimeout(() => this.close(), 1500);
          } catch {
            this.submitError.set(true);
          }
        },
      },
    },
  );

  // ── Computed ───────────────────────────────────────────────────────────────
  protected readonly titleLength = computed(
    () => (this.taskForm.title().value() ?? '').length,
  );

  protected readonly isSprintTask = computed(() => this.selectedType() === 'sprint');

  protected readonly isDirty = computed(
    () =>
      this.titleLength() > 0 ||
      (this.taskForm.description().value() ?? '').length > 0 ||
      this.tags().length > 0,
  );

  // ── Options ────────────────────────────────────────────────────────────────
  protected readonly priorityOptions: ReadonlyArray<{ value: Priority; label: string }> = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  protected readonly typeOptions: ReadonlyArray<{ value: TaskType; label: string }> = [
    { value: 'task', label: 'Task' },
    { value: 'sprint', label: 'Sprint task' },
  ];

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  constructor() {
    if (this.dialogRef) {
      this.dialogRef.backdropClick
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.tryClose());
    }
  }

  // ── Segmented control handlers ─────────────────────────────────────────────
  protected setPriority(p: Priority): void {
    this.selectedPriority.set(p);
  }

  protected setType(t: TaskType): void {
    this.selectedType.set(t);
    if (t === 'task') this.deadlineError.set('');
  }

  // ── Class helpers ──────────────────────────────────────────────────────────
  protected getPriorityBtnClass(value: Priority): string {
    const base = 'segment-btn';
    return this.selectedPriority() === value ? `${base} segment-btn--${value}` : base;
  }

  protected getTypeBtnClass(value: TaskType): string {
    const base = 'segment-btn';
    return this.selectedType() === value ? `${base} segment-btn--type-active` : base;
  }

  // ── Tag handlers ───────────────────────────────────────────────────────────
  protected onTagInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    if (val.endsWith(',')) {
      this.addTag(val.slice(0, -1).trim());
    } else {
      this.tagInputValue.set(val);
    }
  }

  protected onTagKeydown(event: KeyboardEvent): void {
    const val = this.tagInputValue().trim();
    if (event.key === 'Enter' && val) {
      event.preventDefault();
      this.addTag(val);
    }
    if (event.key === 'Backspace' && !this.tagInputValue() && this.tags().length) {
      this.tags.update((t) => t.slice(0, -1));
    }
  }

  private addTag(value: string): void {
    const tag = value.trim();
    if (!tag || tag.length > 20 || this.tags().length >= this.MAX_TAGS) return;
    if (!this.tags().includes(tag)) this.tags.update((t) => [...t, tag]);
    this.tagInputValue.set('');
  }

  protected removeTag(tag: string): void {
    this.tags.update((t) => t.filter((x) => x !== tag));
  }

  // ── Close / dirty guard ────────────────────────────────────────────────────
  protected tryClose(): void {
    if (this.isDirty()) {
      this.showDirtyGuard.set(true);
    } else {
      this.close();
    }
  }

  protected close(): void {
    this.dialogRef?.close();
  }

  protected stayInForm(): void {
    this.showDirtyGuard.set(false);
  }
}
