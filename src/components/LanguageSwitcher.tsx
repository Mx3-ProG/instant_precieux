import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { LANGUAGES, useI18n, type LanguageCode } from "@/i18n";

interface Props {
  className?: string;
}

const LanguageSwitcher = ({ className = "" }: Props) => {
  const { language, setLanguage, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
        aria-label={t("lang.label")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="w-5 h-5" />
        <span>{current.short}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("lang.label")}
          className="absolute bottom-full mb-2 start-0 z-[70] min-w-[150px] border border-input bg-background py-1"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                role="option"
                aria-selected={lang.code === language}
                lang={lang.code}
                dir={lang.dir}
                onClick={() => {
                  setLanguage(lang.code as LanguageCode);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between gap-3 px-4 py-2 text-sm hover:opacity-60 transition-opacity"
              >
                <span>{lang.label}</span>
                {lang.code === language && <Check className="w-4 h-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
