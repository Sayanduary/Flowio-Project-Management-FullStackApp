import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, UsersIcon, FolderOpen } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import CreateProjectDialog from "./CreateProjectDialog";

const statusBadges = {
    PLANNING: {
        label: "Planning",
        style: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700",
    },
    ACTIVE: {
        label: "Active",
        style: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/60",
    },
    ON_HOLD: {
        label: "On Hold",
        style: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60",
    },
    COMPLETED: {
        label: "Completed",
        style: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60",
    },
    CANCELLED: {
        label: "Cancelled",
        style: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60",
    }
};

const priorityBadges = {
    LOW: {
        label: "Low",
        style: "text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700",
    },
    MEDIUM: {
        label: "Medium",
        style: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/50",
    },
    HIGH: {
        label: "High",
        style: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/50",
    },
};

const ProjectOverview = () => {
    const currentWorkspace = useSelector((state) => state?.workspace?.currentWorkspace || null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setProjects(currentWorkspace?.projects || []);
    }, [currentWorkspace]);

    return currentWorkspace && (
        <div className="bg-white dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden transition-all duration-200">
            <div className="border-b border-slate-200/80 dark:border-zinc-800 p-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FolderOpen className="size-4 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Project Overview</h2>
                </div>
                <Link to={'/projects'} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                    <span>View all</span>
                    <ArrowRight className="size-3.5" />
                </Link>
            </div>

            <div className="p-0">
                {projects.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="size-14 mx-auto mb-3 bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 rounded-2xl flex items-center justify-center">
                            <FolderOpen size={28} />
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">No projects yet</h4>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Get started by creating your team's first project</p>
                        <button
                            onClick={() => setIsDialogOpen(true)}
                            className="mt-4 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-xs"
                        >
                            Create First Project
                        </button>
                        <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200/80 dark:divide-zinc-800">
                        {projects.slice(0, 5).map((project) => (
                            <Link
                                key={project.id}
                                to={`/projectsDetail?id=${project.id}&tab=tasks`}
                                className="block p-5 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors group"
                            >
                                <div className="flex items-start justify-between mb-2.5">
                                    <div className="flex-1 pr-4">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {project.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                                            {project.description || 'No description provided'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${statusBadges[project.status]?.style || "bg-slate-100 text-slate-700"}`}>
                                            {statusBadges[project.status]?.label || project.status}
                                        </span>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${priorityBadges[project.priority]?.style || ""}`}>
                                            {priorityBadges[project.priority]?.label || project.priority}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 mb-2.5">
                                    <div className="flex items-center gap-4">
                                        {project.members?.length > 0 && (
                                            <div className="flex items-center gap-1.5">
                                                <UsersIcon className="size-3.5 text-slate-400" />
                                                <span>{project.members.length} member{project.members.length > 1 ? "s" : ""}</span>
                                            </div>
                                        )}
                                        {project.end_date && (
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="size-3.5 text-slate-400" />
                                                <span>{format(new Date(project.end_date), "MMM d, yyyy")}</span>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        {project.progress || 0}%
                                    </span>
                                </div>

                                <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
                                        style={{ width: `${Math.min(100, Math.max(0, project.progress || 0))}%` }}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectOverview;
