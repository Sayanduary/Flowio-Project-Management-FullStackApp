import { useEffect, useState } from 'react';
import { CheckSquareIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/react';

function MyTasksSidebar() {
    const { user } = useUser();
    const { currentWorkspace } = useSelector((state) => state.workspace);
    const [showMyTasks, setShowMyTasks] = useState(false);
    const [myTasks, setMyTasks] = useState([]);

    const toggleMyTasks = () => setShowMyTasks(prev => !prev);

    const getTaskStatusColor = (status) => {
        switch (status) {
            case 'DONE':
                return 'bg-green-500';
            case 'IN_PROGRESS':
                return 'bg-yellow-500';
            case 'TODO':
                return 'bg-gray-500 dark:bg-zinc-500';
            default:
                return 'bg-gray-400 dark:bg-zinc-400';
        }
    };

    const fetchUserTasks = () => {
        const userId = user?.id || '';
        const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || '';
        if (!userId || !currentWorkspace?.projects) {
            setMyTasks([]);
            return;
        }
        const currentWorkspaceTasks = currentWorkspace.projects.flatMap((project) => {
            return (project.tasks || []).filter((task) =>
                task?.assigneeId === userId ||
                task?.assignee?.id === userId ||
                (userEmail && task?.assignee?.email === userEmail)
            );
        });

        setMyTasks(currentWorkspaceTasks);
    };

    useEffect(() => {
        fetchUserTasks();
    }, [currentWorkspace, user]);

    return (
        <div className="mt-4 px-3">
            <div
                onClick={toggleMyTasks}
                className="flex items-center justify-between px-3.5 py-2 rounded-lg cursor-pointer hover:bg-slate-100/80 dark:hover:bg-zinc-900/60 text-slate-700 dark:text-zinc-300 transition-colors"
            >
                <div className="flex items-center gap-2.5">
                    <CheckSquareIcon className="size-4 text-slate-500 dark:text-zinc-400" />
                    <h3 className="text-sm font-medium">My Tasks</h3>
                    <span className="bg-slate-200/80 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[11px] font-mono px-1.5 py-0.5 rounded-full">
                        {myTasks.length}
                    </span>
                </div>
                {showMyTasks ? (
                    <ChevronDownIcon className="size-3.5 text-slate-400 dark:text-zinc-500" />
                ) : (
                    <ChevronRightIcon className="size-3.5 text-slate-400 dark:text-zinc-500" />
                )}
            </div>

            {showMyTasks && (
                <div className="mt-1 pl-2">
                    <div className="space-y-0.5">
                        {myTasks.length === 0 ? (
                            <div className="px-3 py-3 text-xs text-slate-400 dark:text-zinc-500 text-center italic">
                                No tasks assigned to you
                            </div>
                        ) : (
                            myTasks.map((task) => (
                                <Link
                                    key={task.id}
                                    to={`/taskDetails?projectId=${task.projectId}&taskId=${task.id}`}
                                    className="block rounded-lg transition-colors text-slate-600 dark:text-zinc-400 hover:bg-slate-100/80 dark:hover:bg-zinc-900/60 hover:text-slate-900 dark:hover:text-zinc-100 px-3 py-1.5"
                                >
                                    <div className="flex items-center gap-2.5 w-full min-w-0">
                                        <div className={`size-2 rounded-full ${getTaskStatusColor(task.status)} flex-shrink-0`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium truncate">
                                                {task.title}
                                            </p>
                                            <p className="text-[10px] text-slate-400 dark:text-zinc-500 capitalize">
                                                {task.status.toLowerCase().replace('_', ' ')}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyTasksSidebar;
