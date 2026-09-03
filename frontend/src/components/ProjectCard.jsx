import { Link } from "react-router-dom";
import { Users, Calendar, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

const statusBadges = {
    PLANNING: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700",
    ACTIVE: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200/80 dark:border-blue-900/60",
    ON_HOLD: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200/80 dark:border-amber-900/60",
    COMPLETED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-900/60",
    CANCELLED: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200/80 dark:border-rose-900/60",
};

const priorityStyles = {
    HIGH: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/50",
    MEDIUM: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/50",
    LOW: "text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700",
};

const ProjectCard = ({ project }) => {
    return (
        <Link
            to={`/projectsDetail?id=${project.id}&tab=tasks`}
            className="bg-white dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 rounded-xl p-5 transition-all duration-200 group shadow-xs hover:shadow-md flex flex-col justify-between"
        >
            <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                    <h3 className="font-bold text-slate-900 dark:text-zinc-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {project.name}
                    </h3>
                    <ArrowUpRight className="size-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>

                <p className="text-slate-500 dark:text-zinc-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {project.description || "No project description provided."}
                </p>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${statusBadges[project.status] || "bg-slate-100 text-slate-700"}`}>
                        {project.status?.toLowerCase().replace("_", " ")}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border capitalize ${priorityStyles[project.priority] || ""}`}>
                        {project.priority?.toLowerCase()} priority
                    </span>
                </div>
            </div>

            {/* Bottom Meta & Progress */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                    <div className="flex items-center gap-3">
                        {project.members?.length > 0 && (
                            <span className="flex items-center gap-1">
                                <Users className="size-3.5 text-slate-400" />
                                <span>{project.members.length}</span>
                            </span>
                        )}
                        {project.end_date && (
                            <span className="flex items-center gap-1">
                                <Calendar className="size-3.5 text-slate-400" />
                                <span>{format(new Date(project.end_date), "MMM d")}</span>
                            </span>
                        )}
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-zinc-300">
                        {project.progress || 0}%
                    </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, project.progress || 0))}%` }}
                    />
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;
