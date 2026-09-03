import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import MyTasksSidebar from './MyTasksSidebar'
import ProjectSidebar from './ProjectsSidebar'
import WorkspaceDropdown from './WorkspaceDropdown'
import { FolderOpenIcon, LayoutDashboardIcon, SettingsIcon, UsersIcon } from 'lucide-react'

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {

    const menuItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboardIcon },
        { name: 'Projects', href: '/projects', icon: FolderOpenIcon },
        { name: 'Team', href: '/team', icon: UsersIcon },
    ]

    const sidebarRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsSidebarOpen]);

    return (
        <aside
            ref={sidebarRef}
            className={`z-30 bg-slate-50/90 dark:bg-zinc-950 min-w-68 max-w-68 flex flex-col h-screen border-r border-slate-200/80 dark:border-zinc-800/80 max-sm:fixed max-sm:inset-y-0 transition-all duration-300 ${
                isSidebarOpen ? 'left-0 shadow-2xl' : '-left-full sm:left-0'
            }`}
        >
            {/* Top Workspace Header */}
            <WorkspaceDropdown />
            <div className="h-[1px] bg-slate-200/80 dark:bg-zinc-800/80" />

            {/* Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between py-3">
                <div>
                    {/* Primary Links */}
                    <div className="px-3 space-y-1">
                        {menuItems.map((item) => (
                            <NavLink
                                to={item.href}
                                key={item.name}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                                        isActive
                                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                                            : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100/80 dark:hover:bg-zinc-900/60'
                                    }`
                                }
                            >
                                <item.icon size={17} className="flex-shrink-0" />
                                <span className="truncate">{item.name}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* Section Dividers and Sub-items */}
                    <MyTasksSidebar />
                    <ProjectSidebar />
                </div>
            </div>
        </aside>
    );
}

export default Sidebar
