import React from 'react';
import { Sun, Moon, Sparkles, ChefHat } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSelectPresetRandom: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  onSelectPresetRandom,
}) => {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-sm ring-1 ring-amber-400/30">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold tracking-tight text-[var(--accent)] sm:text-2xl">
                RasoiScale
              </span>
              <span className="hidden font-mono text-xs font-semibold text-amber-700 dark:text-amber-400 sm:inline-block">
                v2.0
              </span>
            </div>
            <p className="text-xs font-medium text-[var(--muted)]">
              சமையல் அளவு <span className="opacity-60">·</span> Precision Indian Recipe Rescaler
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onSelectPresetRandom}
            className="glow-btn hidden items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3 py-1.5 text-xs font-bold text-[var(--text)] sm:flex"
            title="Load an authentic regional dish"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>Random Preset</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            id="theme-toggle"
            className="glow-btn flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-xs font-bold text-[var(--text)] shadow-xs"
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                <span className="hidden xs:inline sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-amber-600" />
                <span className="hidden xs:inline sm:inline">Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
