import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroCalendarDays,
  heroClock,
  heroFlag,
  heroSquares2x2,
  heroPencilSquare,
  heroTrash,
  heroFaceFrown,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-task-details',
  imports: [RouterLink, NgIconComponent],
  templateUrl: './task-details.html',
  styleUrl: './task-details.scss',
  viewProviders: [
    provideIcons({
      heroCalendarDays,
      heroClock,
      heroFlag,
      heroSquares2x2,
      heroPencilSquare,
      heroTrash,
      heroFaceFrown,
    }),
  ],
})
export class TaskDetails {}
