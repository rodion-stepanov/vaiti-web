import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <button
        onClick={toggleTheme}
        className="group hover:bg-accent cursor-pointer rounded-lg p-2 transition-colors"
      >
        <div className="relative h-5 w-5">
          <SunIcon
            className={`absolute transition-all duration-300 ${theme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'}`}
          />
          <MoonIcon
            className={`absolute transition-all duration-300 ${theme === 'light' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`}
          />
        </div>
      </button>
    </>
  );
}
