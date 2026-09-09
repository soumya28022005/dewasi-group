import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Matches every route except api, _next, and files with an extension,
  // so unprefixed URLs for the default locale still work correctly.
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
