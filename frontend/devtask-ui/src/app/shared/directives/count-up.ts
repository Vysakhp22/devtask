import { Directive, ElementRef, effect, inject, input } from '@angular/core';

@Directive({
  selector: '[appCountUp]',
})
export class CountUp {
  /** The target number to count up to */
  readonly target = input.required<number>({ alias: 'appCountUp' });

  /** Animation duration in milliseconds */
  readonly duration = input<number>(1500);

  private readonly el = inject(ElementRef<HTMLElement>);

  private rafId: number | null = null;

  constructor() {
    // Re-runs the animation whenever target or duration changes
    effect(() => {
      const end = this.target();
      const ms = this.duration();
      this.animateCount(end, ms);
    });
  }

  private animateCount(end: number, ms: number): void {
    // Cancel any in-progress animation before starting a new one
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }

    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / ms, 1);

      // Ease-out effect: starts fast, slows down at the end
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(end * easedProgress);

      this.el.nativeElement.textContent = current.toString();

      if (progress < 1) {
        this.rafId = requestAnimationFrame(step);
      }
    };

    this.rafId = requestAnimationFrame(step);
  }
}

