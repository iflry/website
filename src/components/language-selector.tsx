"use client"

import React from 'react';
import {Link, usePathname} from '@/src/i18n/navigation';
import { routing } from '../i18n/routing';

export default function LanguageSelector({ locale }: { locale: string }) {
  const pathname = usePathname();
  const languageNames: Record<string, string> = {
    en: 'English',
    fr: 'Français',
    es: 'Español',
  };
  
  return (
    <div className="mt-4 flex justify-center">
      <div className="flex items-center gap-2 text-sm">
          {routing.locales.map((value) => (
            <Link key={value} locale={value} href={pathname}>
              {languageNames[value] || value}
            </Link>
          ))}
      </div>
    </div>
  );
} 