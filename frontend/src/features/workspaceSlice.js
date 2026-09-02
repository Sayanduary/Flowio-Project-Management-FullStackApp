import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../configs/api";

export const fetchWorkspaces = createAsyncThunk(
  "workspace/fetchWorkspaces",

  async ({ getToken }, { rejectWithValue }) => {
    try {
      const token = await getToken();

      const { data } = await api.get("/api/workspaces", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data.workspaces || [];
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch workspaces";

      console.error("fetchWorkspaces:", message);

      return rejectWithValue(message);
    }
  },
);

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspace",

  initialState,

  reducers: {
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    },

    setCurrentWorkspace: (state, action) => {
      localStorage.setItem("currentWorkspaceId", action.payload);

      state.currentWorkspace = state.workspaces.find(
        (workspace) => workspace.id === action.payload,
      );
    },

    addWorkspace: (state, action) => {
      state.workspaces.push(action.payload);
      state.currentWorkspace = action.payload;

      localStorage.setItem("currentWorkspaceId", action.payload.id);
    },

    updateWorkspace: (state, action) => {
      state.workspaces = state.workspaces.map((workspace) =>
        workspace.id === action.payload.id ? action.payload : workspace,
      );

      if (state.currentWorkspace?.id === action.payload.id) {
        state.currentWorkspace = action.payload;
      }
    },

    deleteWorkspace: (state, action) => {
      state.workspaces = state.workspaces.filter(
        (workspace) => workspace.id !== action.payload,
      );

      if (state.currentWorkspace?.id === action.payload) {
        state.currentWorkspace = null;
        localStorage.removeItem("currentWorkspaceId");
      }
    },

    addProject: (state, action) => {
      if (!state.currentWorkspace) return;

      state.currentWorkspace.projects.push(action.payload);

      state.workspaces = state.workspaces.map((workspace) =>
        workspace.id === state.currentWorkspace.id
          ? {
              ...workspace,
              projects: [...workspace.projects, action.payload],
            }
          : workspace,
      );
    },

    addTask: (state, action) => {
      if (!state.currentWorkspace) return;

      state.currentWorkspace.projects = state.currentWorkspace.projects.map(
        (project) => {
          if (project.id === action.payload.projectId) {
            project.tasks.push(action.payload);
          }

          return project;
        },
      );

      state.workspaces = state.workspaces.map((workspace) =>
        workspace.id === state.currentWorkspace.id
          ? {
              ...workspace,
              projects: workspace.projects.map((project) =>
                project.id === action.payload.projectId
                  ? {
                      ...project,
                      tasks: [...project.tasks, action.payload],
                    }
                  : project,
              ),
            }
          : workspace,
      );
    },

    updateTask: (state, action) => {
      if (!state.currentWorkspace) return;

      state.currentWorkspace.projects = state.currentWorkspace.projects.map(
        (project) =>
          project.id === action.payload.projectId
            ? {
                ...project,
                tasks: project.tasks.map((task) =>
                  task.id === action.payload.id ? action.payload : task,
                ),
              }
            : project,
      );

      state.workspaces = state.workspaces.map((workspace) =>
        workspace.id === state.currentWorkspace.id
          ? {
              ...workspace,
              projects: workspace.projects.map((project) =>
                project.id === action.payload.projectId
                  ? {
                      ...project,
                      tasks: project.tasks.map((task) =>
                        task.id === action.payload.id ? action.payload : task,
                      ),
                    }
                  : project,
              ),
            }
          : workspace,
      );
    },

    deleteTask: (state, action) => {
      if (!state.currentWorkspace) return;

      /*
       * Expected payload:
       * {
       *   projectId: "...",
       *   taskIds: ["...", "..."]
       * }
       */

      const { projectId, taskIds } = action.payload;

      state.currentWorkspace.projects = state.currentWorkspace.projects.map(
        (project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.filter(
                  (task) => !taskIds.includes(task.id),
                ),
              }
            : project,
      );

      state.workspaces = state.workspaces.map((workspace) =>
        workspace.id === state.currentWorkspace.id
          ? {
              ...workspace,
              projects: workspace.projects.map((project) =>
                project.id === projectId
                  ? {
                      ...project,
                      tasks: project.tasks.filter(
                        (task) => !taskIds.includes(task.id),
                      ),
                    }
                  : project,
              ),
            }
          : workspace,
      );
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.workspaces = action.payload;

        if (action.payload.length === 0) {
          state.currentWorkspace = null;
          return;
        }

        const savedWorkspaceId = localStorage.getItem("currentWorkspaceId");

        const savedWorkspace = action.payload.find(
          (workspace) => workspace.id === savedWorkspaceId,
        );

        state.currentWorkspace = savedWorkspace || action.payload[0];

        /*
         * Save the selected workspace so that the next
         * page load opens the same workspace.
         */
        localStorage.setItem("currentWorkspaceId", state.currentWorkspace.id);
      })

      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch workspaces";
      });
  },
});

export const {
  setWorkspaces,
  setCurrentWorkspace,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addProject,
  addTask,
  updateTask,
  deleteTask,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
