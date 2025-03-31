│   index.html
│   main.ts
│   styles.scss
│   
├───app
│   │   app.component.html
│   │   app.component.scss
│   │   app.component.spec.ts
│   │   app.component.ts
│   │   app.config.ts
│   │   app.routes.ts
│   │
│   ├───core
│   │   ├───components
│   │   │   ├───header
│   │   │   │       header.component.html
│   │   │   │       header.component.scss
│   │   │   │       header.component.spec.ts
│   │   │   │       header.component.ts
│   │   │   │
│   │   │   └───side-nav
│   │   │           side-nav.component.html
│   │   │           side-nav.component.scss
│   │   │           side-nav.component.spec.ts
│   │   │           side-nav.component.ts
│   │   │
│   │   ├───guards
│   │   │       auth.guard.ts
│   │   │
│   │   ├───models
│   │   │       contacts.ts
│   │   │       tasks.ts
│   │   │       users.ts
│   │   │
│   │   └───services
│   │           active-route.service.spec.ts
│   │           active-route.service.ts
│   │           auth.service.spec.ts
│   │           auth.service.ts
│   │           date-formatter.service.spec.ts
│   │           date-formatter.service.ts
│   │           firebase.service.spec.ts
│   │           firebase.service.ts
│   │           random-color.service.spec.ts
│   │           random-color.service.ts
│   │           task-data.service.spec.ts
│   │           task-data.service.ts
│   │           theme.service.spec.ts
│   │           theme.service.ts
│   │           user.service.spec.ts
│   │           user.service.ts
│   │
│   ├───modules
│   │   ├───authentication
│   │   │   ├───login
│   │   │   │       login.component.html
│   │   │   │       login.component.scss
│   │   │   │       login.component.spec.ts
│   │   │   │       login.component.ts
│   │   │   │
│   │   │   └───registration
│   │   │           registration.component.html
│   │   │           registration.component.scss
│   │   │           registration.component.spec.ts
│   │   │           registration.component.ts
│   │   │
│   │   ├───board
│   │   │   │   board.component.html
│   │   │   │   board.component.scss
│   │   │   │   board.component.spec.ts
│   │   │   │   board.component.ts
│   │   │   │
│   │   │   ├───add-task-dialog
│   │   │   │       add-task-dialog.component.html
│   │   │   │       add-task-dialog.component.scss
│   │   │   │       add-task-dialog.component.spec.ts
│   │   │   │       add-task-dialog.component.ts
│   │   │   │
│   │   │   ├───task-card
│   │   │   │       task-card.component.html
│   │   │   │       task-card.component.scss
│   │   │   │       task-card.component.spec.ts
│   │   │   │       task-card.component.ts
│   │   │   │
│   │   │   └───task-detail-view
│   │   │           task-detail-view.component.html
│   │   │           task-detail-view.component.scss
│   │   │           task-detail-view.component.spec.ts
│   │   │           task-detail-view.component.ts
│   │   │
│   │   ├───contacts
│   │   │   │   contacts.component.html
│   │   │   │   contacts.component.scss
│   │   │   │   contacts.component.spec.ts
│   │   │   │   contacts.component.ts
│   │   │   │
│   │   │   ├───delete-dialog
│   │   │   │       delete-dialog.component.html
│   │   │   │       delete-dialog.component.scss
│   │   │   │       delete-dialog.component.spec.ts
│   │   │   │       delete-dialog.component.ts
│   │   │   │
│   │   │   └───popup-contact-form
│   │   │           popup-contact-form.component.html
│   │   │           popup-contact-form.component.scss
│   │   │           popup-contact-form.component.spec.ts
│   │   │           popup-contact-form.component.ts
│   │   │
│   │   ├───legal-and-help
│   │   │   │   legal-and-help.component.html
│   │   │   │   legal-and-help.component.scss
│   │   │   │   legal-and-help.component.spec.ts
│   │   │   │   legal-and-help.component.ts
│   │   │   │
│   │   │   ├───help-page
│   │   │   │       help-page.component.html
│   │   │   │       help-page.component.scss
│   │   │   │       help-page.component.spec.ts
│   │   │   │       help-page.component.ts
│   │   │   │
│   │   │   ├───legal-notice
│   │   │   │       legal-notice.component.html
│   │   │   │       legal-notice.component.scss
│   │   │   │       legal-notice.component.spec.ts
│   │   │   │       legal-notice.component.ts
│   │   │   │
│   │   │   └───privacy-policy
│   │   │           privacy-policy.component.html
│   │   │           privacy-policy.component.scss
│   │   │           privacy-policy.component.spec.ts
│   │   │           privacy-policy.component.ts
│   │   │
│   │   ├───summary
│   │   │       summary.component.html
│   │   │       summary.component.scss
│   │   │       summary.component.spec.ts
│   │   │       summary.component.ts
│   │   │
│   │   └───tasks
│   │       │   tasks.component.html
│   │       │   tasks.component.scss
│   │       │   tasks.component.spec.ts
│   │       │   tasks.component.ts
│   │       │
│   │       ├───add-task
│   │       │       add-task.component.html
│   │       │       add-task.component.scss
│   │       │       add-task.component.spec.ts
│   │       │       add-task.component.ts
│   │       │
│   │       └───edit-task
│   │               edit-task.component.html
│   │               edit-task.component.scss
│   │               edit-task.component.spec.ts
│   │               edit-task.component.ts
│   │
│   └───shared
│       ├───ui
│       └───utils
│               add-task-state.pipe.spec.ts
│               add-task-state.pipe.ts
│               assigned-user-overflow.pipe.spec.ts
│               assigned-user-overflow.pipe.ts
│               email.pipe.spec.ts
│               email.pipe.ts
│               first-letter.pipe.spec.ts
│               first-letter.pipe.ts
│               phone-number.pipe.spec.ts
│               phone-number.pipe.ts
│               prio-icon.pipe.spec.ts
│               prio-icon.pipe.ts
│               slice-assigned-user.pipe.spec.ts
│               slice-assigned-user.pipe.ts
│               subtask-progress.pipe.spec.ts
│               subtask-progress.pipe.ts
│               unix-to-date.pipe.spec.ts
│               unix-to-date.pipe.ts
│
├───assets
│   │   test_data2.json
│   │
│   ├───fonts
│   │   └───inter
│   │           Inter_18pt-Bold.ttf
│   │           Inter_18pt-Medium.ttf
│   │           Inter_18pt-Regular.ttf
│   │
│   └───img
├───environments
│       environment.ts
│
└───styles
        auth-form.scss
