import { languages, defaultLang } from './ui';

export function getLangFromUrl(url: URL): keyof typeof languages {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as keyof typeof languages;
  return defaultLang;
}
