import { useEffect, useState } from "react";
import { ArrowRight, Clock, AlertTriangle, User } from "lucide-react";
import { useSelector } from "react-redux";
import { useUser } from "@clerk/react";

export default function TasksSummary() {
    const { user } = useUser();
    const { currentWorkspace } = useSelector((state) => state.workspace);
    const [tasks, setTasks] = useState([]);

    // Get all tasks for all projects in current workspace
    useEffect(() => {
        if (currentWorkspace?.projects) {
            setTasks(currentWorkspace.projects.flatMap((project) => project.tasks || []));
        } else {
            setTasks([]);
        }
    }, [currentWorkspace]);

    const userId = user?.id || '';
    const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || '';
    const myTasks = tasks.filter(
        (i) =>
            i.assigneeId === userId ||
            i.assignee?.id === userId ||
            (userEmail && i.assignee?.email === userEmail)
    );
    const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'DONE');
    const inProgressIssues = tasks.filter(i => i.status === 'IN_PROGRESS');

    const summaryCards = [
        {
            title: "My Tasks",
            count: myTasks.length,
            icon: User,
            color: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/60",
            items: myTasks.slice(0, 3)
        },
        {
            title: "Overdue Tasks",
            count: overdueTasks.length,
            icon: AlertTriangle,
            color: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60",
            items: overdueTasks.slice(0, 3)
        },
        {
            title: "In Progress",
            count: inProgressIssues.length,
            icon: Clock,
            color: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60",
            items: inProgressIssues.slice(0, 3)
        }
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            {summaryCards.map((card) => (
                <div key={card.title} className="bg-white dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden transition-all duration-200">
                    <div className="border-b border-slate-200/80 dark:border-zinc-800 p-4 px-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-slate-100 dark:bg-zinc-800 rounded-lg text-slate-600 dark:text-zinc-400">
                                    <card.icon className="size-4" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">{card.title}</h3>
                            </div>
                            <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${card.color}`}>
                                {card.count}
                            </span>
                        </div>
                    </div>

                    <div className="p-4">
                        {card.items.length === 0 ? (
                            <p className="text-xs text-slate-400 dark:text-zinc-500 text-center py-4 italic">
                                No {card.title.toLowerCase()} found
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {card.items.map((issue) => (
                                    <div
                                        key={issue.id}
                                        className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/60 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors border border-slate-100 dark:border-zinc-800/80 cursor-pointer group"
                                    >
                                        <h4 className="text-xs font-semibold text-slate-900 dark:text-zinc-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                            {issue.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 dark:text-zinc-400 font-medium">
                                            <span className="uppercase px-1.5 py-0.5 rounded bg-white dark:bg-zinc-700/60 border border-slate-200 dark:border-zinc-700">
                                                {issue.type}
                                            </span>
                                            <span className="capitalize">
                                                {issue.priority?.toLowerCase()} priority
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {card.count > 3 && (
                                    <button className="flex items-center justify-center w-full text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-1">
                                        <span>View {card.count - 3} more</span>
                                        <ArrowRight className="size-3 ml-1" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
