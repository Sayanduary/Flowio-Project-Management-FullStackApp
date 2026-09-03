import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon, PlusIcon, SettingsIcon, BarChart3Icon, CalendarIcon, FileStackIcon, ZapIcon } from "lucide-react";
import ProjectAnalytics from "../components/ProjectAnalytics";
import ProjectSettings from "../components/ProjectSettings";
import CreateTaskDialog from "../components/CreateTaskDialog";
import ProjectCalendar from "../components/ProjectCalendar";
import ProjectTasks from "../components/ProjectTasks";

export default function ProjectDetail() {

    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab');
    const id = searchParams.get('id');

    const navigate = useNavigate();
    const projects = useSelector((state) => state?.workspace?.currentWorkspace?.projects || []);

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [activeTab, setActiveTab] = useState(tab || "tasks");

    useEffect(() => {
        if (tab) setActiveTab(tab);
    }, [tab]);

    useEffect(() => {
        if (projects && projects.length > 0) {
            const proj = projects.find((p) => p.id === id);
            setProject(proj);
            setTasks(proj?.tasks || []);
        }
    }, [id, projects]);

    const statusBadges = {
        PLANNING: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700",
        ACTIVE: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200/80 dark:border-blue-900/60",
        ON_HOLD: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200/80 dark:border-amber-900/60",
        COMPLETED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-900/60",
        CANCELLED: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200/80 dark:border-rose-900/60",
    };

    if (!project) {
        return (
            <div className="p-12 text-center text-slate-900 dark:text-zinc-100 max-w-md mx-auto my-20 bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8">
                <p className="text-xl font-bold mb-2">Project not found</p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6">The project you are looking for may have been removed or renamed.</p>
                <button
                    onClick={() => navigate('/projects')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
                >
                    <ArrowLeftIcon className="size-3.5" />
                    <span>Back to Projects</span>
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto text-slate-900 dark:text-zinc-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200/60 dark:border-zinc-800/60">
                <div className="flex items-center gap-3">
                    <button
                        className="p-2 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400 transition-colors"
                        onClick={() => navigate('/projects')}
                        title="Back to Projects"
                    >
                        <ArrowLeftIcon className="size-4" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                                {project.name}
                            </h1>
                            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${statusBadges[project.status] || "bg-slate-100 text-slate-700"}`}>
                                {project.status?.toLowerCase().replace("_", " ")}
                            </span>
                        </div>
                        {project.description && (
                            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                                {project.description}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => setShowCreateTask(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <PlusIcon className="size-4" />
                    <span>New Task</span>
                </button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Tasks", value: tasks.length, color: "text-slate-900 dark:text-white", bg: "bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300" },
                    { label: "Completed", value: tasks.filter((t) => t.status === "DONE").length, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400" },
                    { label: "In Progress", value: tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "TODO").length, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400" },
                    { label: "Team Members", value: project.members?.length || 0, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400" },
                ].map((card, idx) => (
                    <div
                        key={idx}
                        className="bg-white dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 p-4 rounded-xl shadow-xs flex items-center justify-between"
                    >
                        <div>
                            <div className="text-xs text-slate-500 dark:text-zinc-400">{card.label}</div>
                            <div className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</div>
                        </div>
                        <div className={`p-2 rounded-lg ${card.bg}`}>
                            <ZapIcon className="size-4" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Tab Navigation Pill */}
            <div className="space-y-4">
                <div className="inline-flex p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
                    {[
                        { key: "tasks", label: "Tasks", icon: FileStackIcon },
                        { key: "calendar", label: "Calendar", icon: CalendarIcon },
                        { key: "analytics", label: "Analytics", icon: BarChart3Icon },
                        { key: "settings", label: "Settings", icon: SettingsIcon },
                    ].map((tabItem) => {
                        const isActive = activeTab === tabItem.key;
                        return (
                            <button
                                key={tabItem.key}
                                onClick={() => {
                                    setActiveTab(tabItem.key);
                                    setSearchParams({ id: id, tab: tabItem.key });
                                }}
                                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                                    isActive
                                        ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-xs font-semibold"
                                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                                }`}
                            >
                                <tabItem.icon className="size-3.5" />
                                <span>{tabItem.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4">
                    {activeTab === "tasks" && (
                        <div className="bg-white dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-4 sm:p-6 shadow-xs">
                            <ProjectTasks tasks={tasks} />
                        </div>
                    )}
                    {activeTab === "analytics" && (
                        <div className="bg-white dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-4 sm:p-6 shadow-xs">
                            <ProjectAnalytics tasks={tasks} project={project} />
                        </div>
                    )}
                    {activeTab === "calendar" && (
                        <div className="bg-white dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-4 sm:p-6 shadow-xs">
                            <ProjectCalendar tasks={tasks} />
                        </div>
                    )}
                    {activeTab === "settings" && (
                        <div className="bg-white dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-4 sm:p-6 shadow-xs">
                            <ProjectSettings project={project} />
                        </div>
                    )}
                </div>
            </div>

            {/* Create Task Modal */}
            {showCreateTask && <CreateTaskDialog showCreateTask={showCreateTask} setShowCreateTask={setShowCreateTask} projectId={id} />}
        </div>
    );
}
