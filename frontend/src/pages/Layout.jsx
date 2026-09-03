import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadTheme } from "../features/themeSlice";
import { fetchWorkspaces } from "../features/workspaceSlice";
import { Loader2Icon, RefreshCw } from "lucide-react";
import {
  useUser,
  SignIn,
  useAuth,
  CreateOrganization,
  useOrganizationList,
} from "@clerk/react";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { loading, workspaces, error } = useSelector(
    (state) => state.workspace,
  );

  const dispatch = useDispatch();

  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  useEffect(() => {
    if (isLoaded && user) {
      dispatch(fetchWorkspaces({ getToken }));
    }
  }, [isLoaded, user, dispatch, getToken]);

  // When an organization is created in Clerk, re-fetch workspaces from the backend
  useEffect(() => {
    if (userMemberships?.data?.length) {
      const timer = setTimeout(() => {
        dispatch(fetchWorkspaces({ getToken }));
      }, 1500); // 1.5s delay to allow Inngest to finish saving the workspace to PostgreSQL
      return () => clearTimeout(timer);
    }
  }, [userMemberships?.data?.length, dispatch, getToken]);

  // Clerk still loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
        <Loader2Icon className="size-7 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-zinc-950">
        <SignIn />
      </div>
    );
  }

  // Fetching workspaces
  if (loading && workspaces.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-950">
        <Loader2Icon className="size-7 text-blue-500 animate-spin" />
      </div>
    );
  }

  // API error
  if (error && workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 bg-white dark:bg-zinc-950">
        <p className="text-red-500">{error}</p>

        <button
          onClick={() => dispatch(fetchWorkspaces({ getToken }))}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  // No workspace yet
  if (workspaces.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-white dark:bg-zinc-950 p-4">
        <CreateOrganization afterCreateOrganizationUrl="/dashboard" />
        <button
          onClick={() => dispatch(fetchWorkspaces({ getToken }))}
          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Already created your workspace? Click here to refresh
        </button>
      </div>
    );
  }

  return (
    <div className="flex bg-white dark:bg-zinc-950 text-gray-900 dark:text-slate-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-screen">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
