import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace } from "../features/workspaceSlice";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/react";
import { dummyWorkspaces } from "../assets/assets";

function WorkspaceDropdown() {
  const { workspaces } = useSelector((state) => state.workspace);
  const currentWorkspace = useSelector(
    (state) => state.workspace?.currentWorkspace || null,
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openCreateOrganization } = useClerk();

  const onSelectWorkspace = (organizationId) => {
    dispatch(setCurrentWorkspace(organizationId));
    setIsOpen(false);
    navigate("/dashboard");
  };

  const handleCreateWorkspace = () => {
    setIsOpen(false);
    if (openCreateOrganization) {
      openCreateOrganization({
        afterCreateOrganizationUrl: "/dashboard",
      });
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const workspaceList = workspaces.length > 0 ? workspaces : dummyWorkspaces;

  return (
    <div className="relative p-3" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all text-left shadow-xs group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={
              currentWorkspace?.image_url ||
              "https://avatar.vercel.sh/" +
                (currentWorkspace?.name || "workspace")
            }
            alt={currentWorkspace?.name}
            className="size-8 rounded-lg shadow-xs object-cover border border-slate-200 dark:border-zinc-700 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-800 dark:text-zinc-100 text-xs sm:text-sm truncate">
              {currentWorkspace?.name || "Select Workspace"}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 truncate">
              {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <ChevronDown className={`size-4 text-slate-400 dark:text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl top-full left-3 mt-1 overflow-hidden backdrop-blur-md">
          <div className="p-2">
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 px-2.5 pt-1">
              Your Workspaces
            </p>
            <div className="space-y-0.5">
              {workspaceList.map((organization) => (
                <div
                  key={organization.id}
                  onClick={() => onSelectWorkspace(organization.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                    currentWorkspace?.id === organization.id
                      ? "bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                      : "hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                  }`}
                >
                  <img
                    src={
                      organization.image_url ||
                      "https://avatar.vercel.sh/" + organization.name
                    }
                    alt={organization.name}
                    className="size-6 rounded-md object-cover border border-slate-200 dark:border-zinc-700 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {organization.name}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">
                      {organization.members?.length ??
                        organization.membersCount ??
                        0}{" "}
                      members
                    </p>
                  </div>
                  {currentWorkspace?.id === organization.id && (
                    <Check className="size-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-slate-200 dark:border-zinc-800" />

          <div
            onClick={handleCreateWorkspace}
            className="p-2.5 cursor-pointer bg-slate-50/50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-colors"
          >
            <p className="flex items-center text-xs gap-2 text-blue-600 dark:text-blue-400 font-medium">
              <Plus className="size-3.5" />
              <span>Create Workspace</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkspaceDropdown;
