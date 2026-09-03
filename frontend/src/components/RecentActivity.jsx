import { useEffect, useState } from "react";
import { GitCommit, MessageSquare, Clock, Bug, Zap, Square } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";

const typeIcons = {
    BUG: { icon: Bug, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/50" },
    FEATURE: { icon: Zap, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/50" },
    TASK: { icon: Square, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/50" },
    IMPROVEMENT: { icon: MessageSquare, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/50" },
    OTHER: { icon: GitCommit, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/50" },
};

const statusBadges = {
    TODO: { label: "To Do", style: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700" },
    IN_PROGRESS: { label: "In Progress", style: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/60" },
    DONE: { label: "Done", style: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60" },
};

const RecentActivity = () => {
    const [tasks, setTasks] = useState([]);
    const { currentWorkspace } = useSelector((state) => state.workspace);

    const getTasksFromCurrentWorkspace = () => {
        if (!currentWorkspace) return;
        const tasks = currentWorkspace.projects?.flatMap((project) => project.tasks || []) || [];
        setTasks(tasks.slice(0, 6));
    };

    useEffect(() => {
        getTasksFromCurrentWorkspace();
    }, [currentWorkspace]);

    return (
        <div className="bg-white dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden transition-all">
            <div className="border-b border-slate-200/80 dark:border-zinc-800 p-4 px-6 flex items-center gap-2">
                <Clock className="size-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Recent Activity</h2>
            </div>

            <div className="p-0">
                {tasks.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="size-14 mx-auto mb-3 bg-slate-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
                            <Clock className="size-7 text-slate-400 dark:text-zinc-500" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">No recent activity found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200/80 dark:divide-zinc-800">
                        {tasks.map((task) => {
                            const { icon: TypeIcon, color: iconColor, bg: iconBg } = typeIcons[task.type] || { icon: Square, color: "text-slate-500", bg: "bg-slate-100" };

                            return (
                                <div key={task.id} className="p-4 px-6 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                                    <div className="flex items-start gap-3.5">
                                        <div className={`p-2 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                            <TypeIcon className={`size-4 ${iconColor}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">
                                                    {task.title}
                                                </h4>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex-shrink-0 ${statusBadges[task.status]?.style || "bg-slate-100 text-slate-600"}`}>
                                                    {statusBadges[task.status]?.label || task.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-zinc-400">
                                                <span className="capitalize">{task.type.toLowerCase()}</span>
                                                {task.assignee && (
                                                    <div className="flex items-center gap-1">
                                                        <div className="size-4 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-[9px] font-bold">
                                                            {(task.assignee.name || task.assignee.email || "U")[0].toUpperCase()}
                                                        </div>
                                                        <span className="truncate max-w-[120px]">{task.assignee.name || task.assignee.email || "User"}</span>
                                                    </div>
                                                )}
                                                {task.updatedAt && (
                                                    <span>{format(new Date(task.updatedAt), "MMM d, h:mm a")}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
