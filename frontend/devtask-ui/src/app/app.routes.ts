import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'signup',
        loadComponent: () => import('./features/auth/pages/signup/signup').then(m => m.Signup),
    },
    {
        path: 'board',
        loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayout),
        children: [
            {
                path: '',
                loadComponent: () => import('./features/board/pages/kanban-board/kanban-board').then(m => m.KanbanBoard),
            },
            {
                path: 'task-details',
                loadComponent: () => import('./features/board/pages/task-details/task-details').then(m => m.TaskDetails),
            }
        ]
    },
    {
        path: '',
        loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login),
    },
    {
        path: 'sprint',
        loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayout),
        children: [
            {
                path: '',
                loadComponent: () => import('./features/sprint/pages/sprint-dashboard/sprint-dashboard').then(m => m.SprintDashboard),
            }
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
