import { Component } from '@angular/core';
import { KanbanBoard } from "../kanban-board/kanban-board";
import { Navbar } from "../navbar/navbar";

@Component({
  selector: 'app-main-layout',
  imports: [KanbanBoard, Navbar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
