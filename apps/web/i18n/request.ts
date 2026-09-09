import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

import en from '../messages/en.json';
import bn from '../messages/bn.json';
import hi from '../messages/hi.json';

const messagesMap: Record<string, Record<string, any>> = {
  en,
  bn,
  hi,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messagesMap[locale] || messagesMap.en,
  };
});
