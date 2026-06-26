import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login),
    },
    {
        path: 'signup',
        loadComponent: () => import('./features/auth/pages/signup/signup').then(m => m.Signup),
    },
    {
        path: 'board',
        loadComponent: () => import('./features/board/pages/main-layout/main-layout').then(m => m.MainLayout),
        children: [
            {
                path: '',
                loadComponent: () => import('./features/board/pages/kanban-board/kanban-board').then(m => m.KanbanBoard),
            },
        ]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];
