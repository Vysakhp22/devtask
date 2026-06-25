src/
│
├── app/
│   │
│   ├── core/
│   │   ├── constants/
│   │   │   ├── priority.constants.ts
│   │   │   ├── status.constants.ts
│   │   │   └── routes.constants.ts└── api.constants.ts
│   │   │
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   │
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   │
│   │   ├── models/
│   │   │   ├── auth.model.ts
│   │   │   ├── sprint.model.ts
│   │   │   ├── task.model.ts
│   │   │   ├── user.model.ts
│   │   │   └── api-response.model.ts
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── sprint.service.ts
│   │   │   └── task.service.ts
│   │   │
│   │   └── utils/
│   │       ├── date.util.ts
│   │       └── storage.util.ts
│   │
│   ├── layout/
│   │   ├── app-layout/
│   │   │   ├── app-layout.component.ts
│   │   │   ├── app-layout.component.html
│   │   │   └── app-layout.component.scss
│   │   │
│   │   ├── navbar/
│   │   │   ├── navbar.component.ts
│   │   │   ├── navbar.component.html
│   │   │   └── navbar.component.scss
│   │   │
│   │   └── page-container/
│   │       ├── page-container.component.ts
│   │       ├── page-container.component.html
│   │       └── page-container.component.scss
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── button/
│   │   │   ├── confirmation-dialog/
│   │   │   ├── empty-state/
│   │   │   ├── loading-spinner/
│   │   │   ├── priority-badge/
│   │   │   ├── skeleton-card/
│   │   │   ├── status-pill/
│   │   │   └── tag/
│   │   │
│   │   ├── directives/
│   │   │
│   │   └── pipes/
│   │
│   ├── features/
│   │   │
│   │   ├── auth/
│   │   │   ├── pages/
│   │   │   │   └── login/
│   │   │   └── components/
│   │   │
│   │   ├── board/
│   │   │   ├── pages/
│   │   │   │   └── board/
│   │   │   │
│   │   │   └── components/
│   │   │       ├── board-stats/
│   │   │       ├── board-toolbar/
│   │   │       ├── task-card/
│   │   │       └── task-column/
│   │   │
│   │   ├── sprint/
│   │   │   ├── pages/
│   │   │   │   └── sprint/
│   │   │   │
│   │   │   └── components/
│   │   │       ├── burndown-chart/
│   │   │       ├── sprint-summary/
│   │   │       ├── sprint-stats/
│   │   │       └── velocity-card/
│   │   │
│   │   ├── task/
│   │   │   ├── pages/
│   │   │   │   └── task-detail/
│   │   │   │
│   │   │   └── components/
│   │   │       └── task-form/
│   │   │
│   │   └── not-found/
│   │       └── pages/
│   │           └── not-found/
│   │
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.config.ts
│   └── app.routes.ts
│
├── assets/
│   ├── icons/
│   ├── images/
│   └── logos/
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
│
├── styles/
│   ├── _colors.scss
│   ├── _spacing.scss
│   ├── _typography.scss
│   ├── _variables.scss
│   └── _mixins.scss
│
├── main.ts
└── styles.scss