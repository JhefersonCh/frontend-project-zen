import { notificationsInterceptorInterceptor as notificationsInterceptor } from './shared/interceptors/notifications.interceptor.interceptor';
import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID
  //provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
// import { provideClientHydration } from '@angular/platform-browser';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule
} from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getMaterialPaginatorTranslations } from './shared/services/material-paginator-translations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { TransformDateService } from './shared/services/transform-date.service';
import { PreviousUrlService } from './shared/services/previous-url.service';
import {
  BrowserAnimationsModule,
  provideAnimations
} from '@angular/platform-browser/animations';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  MAT_NATIVE_DATE_FORMATS,
  provideNativeDateAdapter
} from '@angular/material/core';
import { ToastrModule } from 'ngx-toastr';
registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNativeDateAdapter(MAT_NATIVE_DATE_FORMATS),
    provideAnimations(),
    importProvidersFrom(
      MatBottomSheetModule,
      MatDialogModule,
      PreviousUrlService,
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        preventDuplicates: true
      })
    ),
    { provide: MatPaginatorIntl, useValue: getMaterialPaginatorTranslations() },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { maxWidth: '700px', width: '95vw', padding: '40px' }
    },
    { provide: LOCALE_ID, useValue: 'es' },
    provideHttpClient(
      withInterceptors([authInterceptor, notificationsInterceptor])
    ),
    DatePipe,
    TransformDateService,
    provideAnimationsAsync()
  ]
};
