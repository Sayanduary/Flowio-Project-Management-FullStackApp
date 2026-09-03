import { FolderOpen, CheckCircle, Users, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useUser } from "@clerk/react";

export default function StatsGrid() {
  const { user } = useUser();
  const currentWorkspace = useSelector(
    (state) => state?.workspace?.currentWorkspace || null,
  );

  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    myTasks: 0,
    overdueIssues: 0,
  });

  const userId = user?.id || "";
  const userEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "";

  const statCards = [
    {
      icon: FolderOpen,
      title: "Total Projects",
      value: stats.totalProjects,
      subtitle: `projects in ${currentWorkspace?.name || "workspace"}`,
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
    },
    {
      icon: CheckCircle,
      title: "Completed Projects",
      value: stats.completedProjects,
      subtitle: `of ${stats.totalProjects} total`,
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-500",
    },
    {
      icon: Users,
      title: "My Tasks",
      value: stats.myTasks,
      subtitle: "assigned to me",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
    },
    {
      icon: AlertTriangle,
      title: "Overdue",
      value: stats.overdueIssues,
      subtitle: "need attention",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-500",
    },
  ];

  useEffect(() => {
    if (currentWorkspace?.projects) {
      const projects = currentWorkspace.projects;
      const totalProjects = projects.length;
      const activeProjects = projects.filter(
        (p) => p.status !== "CANCELLED" && p.status !== "COMPLETED",
      ).length;
      const completedProjects = projects.filter(
        (p) => p.status === "COMPLETED",
      ).length;
      const myTasks = projects.reduce(
        (acc, project) =>
          acc +
          (project.tasks || []).filter(
            (t) =>
              t.assigneeId === userId ||
              t.assignee?.id === userId ||
              (userEmail && t.assignee?.email === userEmail),
          ).length,
        0,
      );
      const overdueIssues = projects.reduce(
        (acc, project) =>
          acc +
          (project.tasks || []).filter(
            (t) =>
              t.due_date &&
              new Date(t.due_date) < new Date() &&
              t.status !== "DONE",
          ).length,
        0,
      );

      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        myTasks,
        overdueIssues,
      });
    }
  }, [currentWorkspace, userId, userEmail]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-6">
      {statCards.map(
        ({ icon: Icon, title, value, subtitle, bgColor, textColor }, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-white dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
                  {title}
                </p>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                  {value}
                </p>
                {subtitle && (
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1 truncate max-w-[150px]">
                    {subtitle}
                  </p>
                )}
              </div>
              <div className={`p-2.5 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <Icon size={20} className={textColor} />
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
