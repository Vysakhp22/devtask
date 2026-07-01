import { Component, computed, signal, afterNextRender } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import type { ChartData, ChartOptions } from 'chart.js';
import { Task } from '@app/core/model/task.model';

// ── Mock sprint tasks (replace with httpResource() when API is ready) ─────────
const MOCK_TASKS: Task[] = [
  { id: '1',  title: 'Set up Signal Forms for task creation',    priority: 'high',   status: 'todo',       deadline: '2026-06-26', tags: ['angular', 'forms'] },
  { id: '2',  title: 'Write unit tests with Vitest',             priority: 'medium', status: 'todo',                               tags: ['testing'] },
  { id: '3',  title: 'Configure GitHub Actions deploy pipeline', priority: 'low',    status: 'todo',       deadline: '2026-06-28', tags: ['devops'] },
  { id: '4',  title: 'Build Kanban board with httpResource()',   priority: 'high',   status: 'inprogress', deadline: '2026-06-26', tags: ['angular', 'api'] },
  { id: '5',  title: 'Spring Boot Task CRUD endpoints',          priority: 'high',   status: 'inprogress',                         tags: ['spring'] },
  { id: '6',  title: 'Dockerize backend and test locally',       priority: 'medium', status: 'inprogress',                         tags: ['docker'] },
  { id: '7',  title: 'Sprint burndown with Angular Aria',        priority: 'medium', status: 'inprogress',                         tags: ['a11y'] },
  { id: '8',  title: 'Create Angular 22 project with CLI',       priority: 'low',    status: 'done',                               tags: ['angular'] },
  { id: '9',  title: 'Task entity and JPA repository',           priority: 'medium', status: 'done',                               tags: ['spring'] },
  { id: '10', title: 'debounced() search bar',                   priority: 'low',    status: 'done',                               tags: ['angular'] },
  { id: '11', title: 'H2 in-memory database setup',              priority: 'low',    status: 'done',                               tags: ['spring'] },
  { id: '12', title: 'GitHub repo and branch structure',         priority: 'low',    status: 'done',                               tags: ['devops'] },
];

const SPRINT_DAYS = 14;
const TOTAL_TASKS = 12;

@Component({
  selector: 'app-sprint-dashboard',
  // BaseChartDirective renders the Chart.js canvas; RouterLink powers the empty-state CTA.
  imports: [BaseChartDirective, RouterLink],
  // provideCharts is registered at component level so Chart.js is only bundled when
  // the sprint route is visited (lazy-loading boundary).
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './sprint-dashboard.html',
  styleUrl: './sprint-dashboard.scss',
})
export class SprintDashboard {

  // ── Chart lazy-load flag ──────────────────────────────────────────────────
  // Starts false so a skeleton is shown on first paint. afterNextRender()
  // delays the actual chart mount until the browser's idle callback fires,
  // keeping the initial paint fast (mirrors injectAsync + onIdle pattern).
  protected readonly chartReady = signal(false);

  // ── Sprint metadata ───────────────────────────────────────────────────────
  protected readonly sprintPeriod = 'Jun 16 – Jun 30';
  protected readonly daysLeft     = 6;

  // ── Task data (swap allTasks for httpResource() when the API is live) ─────
  private readonly allTasks = signal<Task[]>(MOCK_TASKS);

  protected readonly totalTasks       = computed(() => this.allTasks().length);
  protected readonly completedCount   = computed(() => this.allTasks().filter(t => t.status === 'done').length);
  protected readonly remainingCount   = computed(() => this.totalTasks() - this.completedCount());
  protected readonly todoCount        = computed(() => this.allTasks().filter(t => t.status === 'todo').length);
  protected readonly inProgressCount  = computed(() => this.allTasks().filter(t => t.status === 'inprogress').length);
  protected readonly completionPct    = computed(() => Math.round((this.completedCount() / this.totalTasks()) * 100));
  protected readonly todoShare        = computed(() => Math.round((this.todoCount()       / this.totalTasks()) * 100));
  protected readonly inProgressShare  = computed(() => Math.round((this.inProgressCount() / this.totalTasks()) * 100));
  protected readonly doneShare        = computed(() => Math.round((this.completedCount()  / this.totalTasks()) * 100));

  // ── Pace ──────────────────────────────────────────────────────────────────
  protected readonly pace         = 0.8;
  protected readonly paceEndDate  = 'Jun 29';
  protected readonly behindBy     = 2;  // positive = behind; 0 or negative = on track
  protected readonly isOnTrack    = this.behindBy <= 0;

  // ── SVG donut (pure math, no chart library) ───────────────────────────────
  // radius=44 gives a visually comfortable ring inside a 120×120 viewBox.
  protected readonly donutR             = 44;
  protected readonly donutCircumference = +(2 * Math.PI * this.donutR).toFixed(2); // ≈ 276.46
  // stroke-dashoffset shifts the arc backward; 0 = full circle, circumference = empty.
  protected readonly donutOffset        = computed(() =>
    +(this.donutCircumference * (1 - this.completionPct() / 100)).toFixed(2)
  );

  // ── Burndown chart data ───────────────────────────────────────────────────
  // Labels for the X-axis: Day 1 … Day 14.
  protected readonly burndownLabels: string[] = Array.from(
    { length: SPRINT_DAYS }, (_, i) => `Day ${i + 1}`
  );

  // Ideal: perfectly straight diagonal from total → 0.
  protected readonly idealData: number[] = Array.from(
    { length: SPRINT_DAYS },
    (_, i) => +(TOTAL_TASKS - (TOTAL_TASKS / (SPRINT_DAYS - 1)) * i).toFixed(1)
  );

  // Actual: recorded up to Day 8, null for future days (chart won't draw a point).
  protected readonly actualData: (number | null)[] = [
    12, 12, 11, 10, 10, 9, 8, 7,
    null, null, null, null, null, null,
  ];

  protected readonly burndownData: ChartData<'line'> = {
    labels: this.burndownLabels,
    datasets: [
      {
        label: 'Ideal',
        data: this.idealData,
        borderColor: '#D1D5DB',
        borderDash: [6, 4],
        borderWidth: 2,
        pointRadius: 0,     // no points on the ideal line — just a clean dashed line
        fill: false,
        tension: 0,
      },
      {
        label: 'Actual',
        data: this.actualData,
        borderColor: '#6B5CE7',
        backgroundColor: 'transparent',
        borderWidth: 2,
        // Per-point radius array: show circles only where data exists (Days 1–8).
        pointRadius: [4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0],
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#6B5CE7',
        pointBorderWidth: 2,
        fill: false,
        tension: 0.3,
        spanGaps: false,    // do not connect dots across null gaps
      },
    ],
  };

  protected readonly burndownOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    plugins: {
      legend: { display: false },   // legend is rendered as custom HTML pills
      tooltip: {
        backgroundColor: '#1A1A2E',
        titleColor: '#ffffff',
        bodyColor: '#9CA3AF',
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid:   { color: '#F3F4F6' },
        border: { display: false },
        ticks:  { color: '#9CA3AF', font: { size: 11 } },
      },
      y: {
        grid:   { color: '#F3F4F6' },
        border: { display: false },
        ticks:  { color: '#9CA3AF', font: { size: 11 } },
        min: 0,
        max: TOTAL_TASKS,
      },
    },
  };

  constructor() {
    // Defer the chart mount until after first paint using requestIdleCallback
    // when available, falling back to setTimeout — this is the Angular pattern
    // equivalent of injectAsync({ onIdle }) for deferring expensive work.
    afterNextRender(() => {
      const w = window as Window & {
        requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
      };
      if (w.requestIdleCallback) {
        w.requestIdleCallback(() => this.chartReady.set(true), { timeout: 2000 });
      } else {
        setTimeout(() => this.chartReady.set(true), 300);
      }
    });
  }
}
