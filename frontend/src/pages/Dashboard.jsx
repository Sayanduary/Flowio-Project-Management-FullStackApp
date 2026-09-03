import { Plus } from "lucide-react";
import { useState } from "react";
import StatsGrid from "../components/StatsGrid";
import ProjectOverview from "../components/ProjectOverview";
import RecentActivity from "../components/RecentActivity";
import TasksSummary from "../components/TasksSummary";
import CreateProjectDialog from "../components/CreateProjectDialog";
import { useUser } from "@clerk/react";

const Dashboard = () => {
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200/60 dark:border-zinc-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Welcome back, {user?.firstName || user?.fullName || "Builder"}
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-0.5">
            Here is what is happening across your workspace projects today
          </p>
        </div>

        <button
          onClick={() => setIsDialogOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>

        <CreateProjectDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>

      <StatsGrid />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProjectOverview />
          <RecentActivity />
        </div>
        <div>
          <TasksSummary />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
