import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface BreadcrumbItem {
  label: string;
  label_mr?: string;
  view?: string;
  param?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (view: string, param?: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  const { lang, t } = useLanguage();

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 sm:px-0">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-stone-500">
        <li>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 text-stone-600 hover:text-amber-800 transition"
          >
            <Home className="w-3.5 h-3.5 text-amber-700" />
            <span>{t('nav_home')}</span>
          </button>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const displayLabel = (lang === 'mr' && item.label_mr) ? item.label_mr : item.label;

          return (
            <React.Fragment key={index}>
              <li className="text-stone-300">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li>
                {isLast || !item.view ? (
                  <span className="font-semibold text-amber-950 truncate max-w-[200px] sm:max-w-none inline-block">
                    {displayLabel}
                  </span>
                ) : (
                  <button
                    onClick={() => item.view && onNavigate(item.view, item.param)}
                    className="text-stone-600 hover:text-amber-800 transition"
                  >
                    {displayLabel}
                  </button>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
