import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),           // <-- router
    provideClientHydration(),
    provideHttpClient(),             // <-- http client
    {
      provide: HTTP_INTERCEPTORS,   // <-- intercepteur
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};
