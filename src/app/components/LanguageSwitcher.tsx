import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useLanguage, Language } from '../contexts/LanguageContext';
import {
  Language as GlobeIcon,
  Check as CheckIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
  available: boolean;
}

const languages: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇺🇸', available: true },
  { code: 'vi', label: 'Vietnamese', nativeLabel: 'Tiếng Việt', flag: '🇻🇳', available: false },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷', available: false },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', flag: '🇨🇳', available: false },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  const handleSelect = (lang: LanguageOption) => {
    if (lang.available) {
      setLanguage(lang.code);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="hidden relative gap-1.5">
          <GlobeIcon className="w-5 h-5" />
          <span className="text-xs hidden sm:inline">{currentLang.code.toUpperCase()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Language</h3>
          <Badge variant="outline" className="text-xs">
            {currentLang.flag} {currentLang.label}
          </Badge>
        </div>

        {/* Language List */}
        <ScrollArea className="max-h-[320px]">
          <div className="divide-y">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  lang.available
                    ? 'cursor-pointer/50'
                    : 'cursor-not-allowed opacity-60'
                } ${language === lang.code ? 'bg-[#121321]/5' : ''}`}
                onClick={() => handleSelect(lang)}
              >
                {/* Flag */}
                <span className="text-xl flex-shrink-0">{lang.flag}</span>

                {/* Language Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm ${
                        language === lang.code ? 'text-[#121321] dark:text-white' : ''
                      }`}
                    >
                      {lang.label}
                    </p>
                    {!lang.available && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        Coming soon
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{lang.nativeLabel}</p>
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {language === lang.code ? (
                    <CheckIcon className="w-4 h-4 text-[#121321] dark:text-white" />
                  ) : !lang.available ? (
                    <LockIcon className="w-4 h-4 text-muted-foreground/50" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t">
          <p className="text-xs text-muted-foreground text-center">
            More languages will be available in future updates
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
