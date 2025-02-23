import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/authentication/login/login.component').then(
        m => m.LoginComponent
      ),
  },
  {
    path: 'registration',
    loadComponent: () =>
      import('./modules/authentication/registration/registration.component').then(
        m => m.RegistrationComponent
      ),
  },
  {
    path: 'summary',
    loadComponent: () =>
      import('./modules/summary/summary.component').then(
        m => m.SummaryComponent
      ),
  },
  {
    path: 'addtask',
    loadComponent: () =>
      import('./modules/tasks/add-task/add-task.component').then(
        m => m.AddTaskComponent
      ),
  },
  {
    path: 'board',
    loadComponent: () =>
      import('./modules/board/board.component').then(
        m => m.BoardComponent
      ),
  },
  {
    path: 'contacts',
    loadComponent: () =>
      import('./modules/contacts/contacts.component').then(
        m => m.ContactsComponent
      ),
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./modules/legal-and-help/privacy-policy/privacy-policy.component').then(
        m => m.PrivacyPolicyComponent
      ),
  },
  {
    path: 'legal',
    loadComponent: () =>
      import('./modules/legal-and-help/legal-notice/legal-notice.component').then(
        m => m.LegalNoticeComponent
      ),
  },
  {
    path: 'help',
    loadComponent: () =>
      import('./modules/legal-and-help/help-page/help-page.component').then(
        m => m.HelpPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];
