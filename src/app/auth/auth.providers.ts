import { Provider } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiwsAuthProvider } from './apiws-auth.provider';
import { LegacyAspxAuthProvider } from './legacy-aspx-auth.provider';
import { MockAuthProvider } from './mock-auth.provider';
import { USER_AUTH_PROVIDER } from './user-auth.provider';

/**
 * Registra la implementación de `UserAuthProvider` que corresponde al entorno.
 *
 * Migrar del puente .NET legado al endpoint definitivo de `apiws` es cambiar
 * `environment.auth.provider` a 'apiws': ningún componente ni guard cambia.
 */
export function provideUserAuth(): Provider[] {
  const implementaciones = {
    mock: MockAuthProvider,
    legacy: LegacyAspxAuthProvider,
    apiws: ApiwsAuthProvider,
  } as const;

  const implementacion = implementaciones[environment.auth.provider];

  return [
    implementacion,
    { provide: USER_AUTH_PROVIDER, useExisting: implementacion },
  ];
}
