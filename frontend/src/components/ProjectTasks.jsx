import { format } from "date-fns";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import api from "../configs/api";
import { deleteTask, updateTask } from "../features/workspaceSlice";
import { Bug, CalendarIcon, GitCommit, MessageSquare, Square, Trash, XIcon, Zap } from "lucide-react";

const typeIcons = {
    BUG: { icon: Bug, color: "text-rose-600 dark:text-rose-400" },
    FEATURE: { icon: Zap, color: "text-blue-600 dark:text-blue-400" },
    TASK: { icon: Square, color: "text-indigo-600 dark:text-indigo-400" },
    IMPROVEMENT: { icon: GitCommit, color: "text-purple-600 dark:text-purple-400" },
    OTHER: { icon: MessageSquare, color: "text-amber-600 dark:text-amber-400" },
};

const priorityTexts = {
    HIGH: { background: "bg-rose-50 dark:bg-rose-950/60", prioritycolor: "text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60" },
    MEDIUM: { background: "bg-amber-50 dark:bg-amber-950/60", prioritycolor: "text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60" },
    LOW: { background: "bg-slate-100 dark:bg-zinc-800", prioritycolor: "text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700" },
};

const ProjectTasks = ({ tasks }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [selectedTasks, setSelectedTasks] = useState([]);

    const [filters, setFilters] = useState({
        status: "",
        type: "",
        priority: "",
        assignee: "",
    });

    const assigneeList = useMemo(
        () => Array.from(new Set(tasks.map((t) => t.assignee?.name).filter(Boolean))),
        [tasks]
    );

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const { status, type, priority, assignee } = filters;
            return (
                (!status || task.status === status) &&
                (!type || task.type === type) &&
                (!priority || task.priority === priority) &&
                (!assignee || task.assignee?.name === assignee)
            );
        });
    }, [filters, tasks]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = async (taskId, newStatus) => {
        const toastId = toast.loading("Updating status...");
        try {
            const token = await getToken();
            const { data } = await api.put(
                `/api/tasks/${taskId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data?.task) {
                dispatch(updateTask(data.task));
            }
            toast.dismiss(toastId);
            toast.success("Task status updated successfully");
        } catch (error) {
            toast.dismiss(toastId);
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const handleDelete = async () => {
        if (!selectedTasks || selectedTasks.length === 0) return;
        const confirm = window.confirm("Are you sure you want to delete the selected tasks?");
        if (!confirm) return;

        const toastId = toast.loading("Deleting tasks...");
        try {
            const token = await getToken();
            await Promise.all(
                selectedTasks.map((taskId) =>
                    api.delete(`/api/tasks/${taskId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );

            const projectId = tasks.find((t) => selectedTasks.includes(t.id))?.projectId;
            dispatch(deleteTask({ projectId, taskIds: selectedTasks }));
            setSelectedTasks([]);

            toast.dismiss(toastId);
            toast.success("Tasks deleted successfully");
        } catch (error) {
            toast.dismiss(toastId);
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const handleDeleteSingle = async (taskId) => {
        const confirm = window.confirm("Are you sure you want to delete this task?");
        if (!confirm) return;

        const toastId = toast.loading("Deleting task...");
        try {
            const token = await getToken();
            await api.delete(`/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const projectId = tasks.find((t) => t.id === taskId)?.projectId;
            dispatch(deleteTask({ projectId, taskId }));
            setSelectedTasks((prev) => prev.filter((id) => id !== taskId));

            toast.dismiss(toastId);
            toast.success("Task deleted successfully");
        } catch (error) {
            toast.dismiss(toastId);
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    return (
        <div>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                {["status", "type", "priority", "assignee"].map((name) => {
                    const options = {
                        status: [
                            { label: "All Statuses", value: "" },
                            { label: "To Do", value: "TODO" },
                            { label: "In Progress", value: "IN_PROGRESS" },
                            { label: "Done", value: "DONE" },
                        ],
                        type: [
                            { label: "All Types", value: "" },
                            { label: "Task", value: "TASK" },
                            { label: "Bug", value: "BUG" },
                            { label: "Feature", value: "FEATURE" },
                            { label: "Improvement", value: "IMPROVEMENT" },
                            { label: "Other", value: "OTHER" },
                        ],
                        priority: [
                            { label: "All Priorities", value: "" },
                            { label: "High", value: "HIGH" },
                            { label: "Medium", value: "MEDIUM" },
                            { label: "Low", value: "LOW" },
                        ],
                        assignee: [
                            { label: "All Assignees", value: "" },
                            ...assigneeList.map((n) => ({ label: n, value: n })),
                        ],
                    };
                    return (
                        <select
                            key={name}
                            name={name}
                            onChange={handleFilterChange}
                            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-zinc-200 shadow-xs outline-none focus:border-blue-500 cursor-pointer"
                        >
                            {options[name].map((opt, idx) => (
                                <option key={idx} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    );
                })}

                {/* Reset filters */}
                {(filters.status || filters.type || filters.priority || filters.assignee) && (
                    <button
                        type="button"
                        onClick={() => setFilters({ status: "", type: "", priority: "", assignee: "" })}
                        className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-medium hover:bg-slate-100 transition-colors"
                    >
                        <XIcon className="size-3 text-slate-400" />
                        <span>Reset</span>
                    </button>
                )}

                {selectedTasks.length > 0 && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors ml-auto"
                    >
                        <Trash className="size-3" />
                        <span>Delete ({selectedTasks.length})</span>
                    </button>
                )}
            </div>

            {/* Tasks Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
                <div className="w-full">
                    {/* Desktop/Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full text-xs sm:text-sm text-left text-slate-900 dark:text-zinc-200">
                            <thead className="text-[11px] uppercase tracking-wider bg-slate-50 dark:bg-zinc-800/80 text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-zinc-800">
                                <tr>
                                    <th className="pl-4 pr-1 py-3 w-8">
                                        <input
                                            onChange={() => selectedTasks.length > 1 ? setSelectedTasks([]) : setSelectedTasks(tasks.map((t) => t.id))}
                                            checked={selectedTasks.length === tasks.length && tasks.length > 0}
                                            type="checkbox"
                                            className="size-3.5"
                                        />
                                    </th>
                                    <th className="px-4 py-3 font-semibold">Title</th>
                                    <th className="px-4 py-3 font-semibold">Type</th>
                                    <th className="px-4 py-3 font-semibold">Priority</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 font-semibold">Assignee</th>
                                    <th className="px-4 py-3 font-semibold">Due Date</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map((task) => {
                                        const { icon: Icon, color } = typeIcons[task.type] || {};
                                        const { background, prioritycolor } = priorityTexts[task.priority] || { background: "bg-slate-100", prioritycolor: "text-slate-600" };

                                        return (
                                            <tr
                                                key={task.id}
                                                onClick={() => navigate(`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`)}
                                                className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                                            >
                                                <td onClick={e => e.stopPropagation()} className="pl-4 pr-1 py-3">
                                                    <input
                                                        type="checkbox"
                                                        className="size-3.5"
                                                        onChange={() => selectedTasks.includes(task.id) ? setSelectedTasks(selectedTasks.filter((i) => i !== task.id)) : setSelectedTasks((prev) => [...prev, task.id])}
                                                        checked={selectedTasks.includes(task.id)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-zinc-100 max-w-xs truncate">
                                                    {task.title}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        {Icon && <Icon className={`size-3.5 ${color}`} />}
                                                        <span className={`uppercase text-[11px] font-semibold ${color}`}>{task.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${background} ${prioritycolor}`}>
                                                        {task.priority?.toLowerCase()}
                                                    </span>
                                                </td>
                                                <td onClick={e => e.stopPropagation()} className="px-4 py-3">
                                                    <select
                                                        name="status"
                                                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                        value={task.status}
                                                        className="bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 outline-none px-2 py-1 rounded text-xs text-slate-800 dark:text-zinc-200 cursor-pointer focus:border-blue-500"
                                                    >
                                                        <option value="TODO">To Do</option>
                                                        <option value="IN_PROGRESS">In Progress</option>
                                                        <option value="DONE">Done</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <img src={task.assignee?.image} className="size-5 rounded-full object-cover" alt="avatar" />
                                                        <span className="text-xs text-slate-700 dark:text-zinc-300 truncate max-w-[120px]">{task.assignee?.name || "-"}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
                                                        <CalendarIcon className="size-3.5 text-slate-400" />
                                                        <span>{task.due_date ? format(new Date(task.due_date), "dd MMM") : "-"}</span>
                                                    </div>
                                                </td>
                                                <td onClick={(e) => e.stopPropagation()} className="px-4 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        title="Delete Task"
                                                        onClick={() => handleDeleteSingle(task.id)}
                                                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                                                    >
                                                        <Trash className="size-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center text-xs text-slate-400 dark:text-zinc-500 py-10">
                                            No tasks found matching your filter criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile/Card View */}
                    <div className="lg:hidden flex flex-col divide-y divide-slate-100 dark:divide-zinc-800">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task) => {
                                const { icon: Icon, color } = typeIcons[task.type] || {};
                                const { background, prioritycolor } = priorityTexts[task.priority] || {};

                                return (
                                    <div key={task.id} className="p-4 space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-slate-900 dark:text-zinc-100 text-xs font-semibold">{task.title}</h3>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    title="Delete Task"
                                                    onClick={() => handleDeleteSingle(task.id)}
                                                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                                >
                                                    <Trash className="size-3.5" />
                                                </button>
                                                <input
                                                    type="checkbox"
                                                    className="size-3.5"
                                                    onChange={() => selectedTasks.includes(task.id) ? setSelectedTasks(selectedTasks.filter((i) => i !== task.id)) : setSelectedTasks((prev) => [...prev, task.id])}
                                                    checked={selectedTasks.includes(task.id)}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="text-[11px] flex items-center gap-1">
                                                {Icon && <Icon className={`size-3 ${color}`} />}
                                                <span className={`${color} uppercase font-semibold`}>{task.type}</span>
                                            </div>
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${background} ${prioritycolor}`}>
                                                {task.priority?.toLowerCase()}
                                            </span>
                                        </div>

                                        <div>
                                            <select
                                                name="status"
                                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                value={task.status}
                                                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 outline-none px-2.5 py-1.5 rounded-lg text-xs text-slate-900 dark:text-zinc-100"
                                            >
                                                <option value="TODO">To Do</option>
                                                <option value="IN_PROGRESS">In Progress</option>
                                                <option value="DONE">Done</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 pt-1">
                                            <div className="flex items-center gap-1.5">
                                                <img src={task.assignee?.image} className="size-4 rounded-full object-cover" alt="avatar" />
                                                <span>{task.assignee?.name || "-"}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon className="size-3.5 text-slate-400" />
                                                <span>{task.due_date ? format(new Date(task.due_date), "dd MMM") : "-"}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-xs text-slate-400 dark:text-zinc-500 py-6">
                                No tasks found.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectTasks;
