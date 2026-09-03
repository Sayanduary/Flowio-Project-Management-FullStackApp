import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronRightIcon, SettingsIcon, KanbanIcon, ChartColumnIcon, CalendarIcon, ArrowRightIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

const ProjectSidebar = () => {

    const location = useLocation();

    const [expandedProjects, setExpandedProjects] = useState(new Set());
    const [searchParams] = useSearchParams();

    const projects = useSelector(
        (state) => state?.workspace?.currentWorkspace?.projects || []
    );

    const getProjectSubItems = (projectId) => [
        { title: 'Tasks', icon: KanbanIcon, url: `/projectsDetail?id=${projectId}&tab=tasks` },
        { title: 'Analytics', icon: ChartColumnIcon, url: `/projectsDetail?id=${projectId}&tab=analytics` },
        { title: 'Calendar', icon: CalendarIcon, url: `/projectsDetail?id=${projectId}&tab=calendar` },
        { title: 'Settings', icon: SettingsIcon, url: `/projectsDetail?id=${projectId}&tab=settings` }
    ];

    const toggleProject = (id) => {
        const newSet = new Set(expandedProjects);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        setExpandedProjects(newSet);
    };

    return (
        <div className="mt-4 px-3">
            <div className="flex items-center justify-between px-3.5 py-2">
                <h3 className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    Projects
                </h3>
                <Link to="/projects" title="View all projects">
                    <span className="size-5 text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded flex items-center justify-center transition-colors">
                        <ArrowRightIcon className="size-3" />
                    </span>
                </Link>
            </div>

            <div className="space-y-0.5 px-1">
                {projects.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-slate-400 dark:text-zinc-500 italic">
                        No projects yet
                    </div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id}>
                            <button
                                onClick={() => toggleProject(project.id)}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors text-slate-700 dark:text-zinc-300 hover:bg-slate-100/80 dark:hover:bg-zinc-900/60 hover:text-slate-900 dark:hover:text-white text-left"
                            >
                                <ChevronRightIcon
                                    className={`size-3 text-slate-400 dark:text-zinc-500 transition-transform duration-200 ${
                                        expandedProjects.has(project.id) ? 'rotate-90' : ''
                                    }`}
                                />
                                <div className="size-2 rounded-full bg-blue-500 flex-shrink-0" />
                                <span className="truncate max-w-[150px] text-xs font-medium">{project.name}</span>
                            </button>

                            {expandedProjects.has(project.id) && (
                                <div className="ml-4 pl-2 border-l border-slate-200 dark:border-zinc-800 mt-1 space-y-0.5">
                                    {getProjectSubItems(project.id).map((subItem) => {
                                        const isActive =
                                            location.pathname === `/projectsDetail` &&
                                            searchParams.get('id') === project.id &&
                                            searchParams.get('tab') === subItem.title.toLowerCase();

                                        return (
                                            <Link
                                                key={subItem.title}
                                                to={subItem.url}
                                                className={`flex items-center gap-2 px-2.5 py-1 rounded-md transition-colors text-xs ${
                                                    isActive
                                                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-medium'
                                                        : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-zinc-900/50'
                                                }`}
                                            >
                                                <subItem.icon className="size-3 flex-shrink-0" />
                                                <span>{subItem.title}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProjectSidebar;