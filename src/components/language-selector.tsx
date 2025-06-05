"use client"

import React from 'react';
import {Link, usePathname} from '@/src/i18n/navigation';
import { routing } from '../i18n/routing';
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from '@/src/components/ui/dropdown-menu';
import { Button } from '@/src/components/ui/button';
import { GlobeIcon } from 'lucide-react';

export default function LanguageSelector({ locale }: { locale: string }) {
  const pathname = usePathname();
  const languageNames: Record<string, string> = {
    en: 'English',
    fr: 'Français',
    es: 'Español',
  };
  
  return (
    <div className="mt-4 flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <GlobeIcon className="h-4 w-4" />
            {languageNames[locale] || locale}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {routing.locales.map((value) => (
            <Link locale={value} key={value} href={pathname}>
              <DropdownMenuCheckboxItem checked={value === locale}>
                {languageNames[value] || value}
              </DropdownMenuCheckboxItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 