import { SearchIcon, PanelLeft, MoonIcon, SunIcon, Command, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/themeSlice";
import { UserButton } from "@clerk/react";

const Navbar = ({ setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const currentWorkspace = useSelector((state) => state?.workspace?.currentWorkspace || null);

  return (
    <div className="w-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800/80 px-4 sm:px-6 xl:px-10 py-3 flex-shrink-0 z-20">
      <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
        {/* Left section: Sidebar trigger & Search */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Sidebar Trigger */}
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="sm:hidden p-2 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
            aria-label="Toggle Sidebar"
          >
            <PanelLeft size={18} />
          </button>

          {/* Current Workspace Pill (Desktop) */}
          {currentWorkspace && (
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-300">
              <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="font-semibold truncate max-w-[140px]">{currentWorkspace.name}</span>
            </div>
          )}

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 size-3.5" />
            <input
              type="text"
              placeholder="Search tasks, projects, team..."
              className="pl-9 pr-12 py-1.5 w-full bg-slate-50 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition shadow-inner"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 dark:text-zinc-500 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
              <Command className="size-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right section: Theme & User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle Theme"
            className="size-8 sm:size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 shadow-sm transition hover:scale-105 active:scale-95"
          >
            {theme === "light" ? (
              <MoonIcon className="size-4 text-slate-700" />
            ) : (
              <SunIcon className="size-4 text-amber-400" />
            )}
          </button>

          {/* User Button */}
          <div className="pl-1 border-l border-slate-200 dark:border-zinc-800 flex items-center">
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
