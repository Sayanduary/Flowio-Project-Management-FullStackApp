import prisma from "../config/db.js";
import { inngest } from "../inngest/index.js";

// ==========================================
// CREATE TASK
// Only Project Lead can create tasks
// ==========================================
export const createTask = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const {
      projectId,
      title,
      description,
      type,
      status,
      priority,
      assigneeId,
      due_date,
    } = req.body;

    const origin = req.get("origin");

    // Validate required fields
    if (!projectId || !title || !assigneeId || !due_date) {
      return res.status(400).json({
        message: "projectId, title, assigneeId and due_date are required",
      });
    }

    // Find project and project members
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only project lead can create tasks
    if (project.team_lead !== userId) {
      return res.status(403).json({
        message: "Only the project lead can create tasks",
      });
    }

    // Assignee must be a project member or the project lead
    const isAssigneeValid =
      assigneeId === project.team_lead ||
      project.members.some((member) => member.userId === assigneeId);

    if (!isAssigneeValid) {
      return res.status(403).json({
        message: "Assignee must be a member of this project",
      });
    }

    // Validate due date
    const dueDate = new Date(due_date);

    if (Number.isNaN(dueDate.getTime())) {
      return res.status(400).json({
        message: "Invalid due_date",
      });
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description: description || null,
        type: type || "TASK",
        status: status || "TODO",
        priority: priority || "MEDIUM",
        assigneeId,
        due_date: dueDate,
      },

      include: {
        assignee: true,

        comments: {
          include: {
            user: true,
          },
        },

        project: true,
      },
    });

    // Send task assignment event
    try {
      await inngest.send({
        name: "app/task.assigned",
        data: {
          taskId: task.id,
          origin,
        },
      });
    } catch (inngestError) {
      console.warn("Inngest send event warning:", inngestError);
    }

    return res.status(201).json({
      task,
      message: "Task Created Successfully",
    });
  } catch (error) {
    console.error("Create Task Error:", error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};

// ==========================================
// UPDATE TASK
// ==========================================
export const updateTask = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const taskId =
      req.params.taskId || req.params.id || req.body.taskId || req.body.id;

    if (!taskId) {
      return res.status(400).json({
        message: "taskId is required",
      });
    }

    const { title, description, type, status, priority, assigneeId, due_date } =
      req.body;

    // Find task and project
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        project: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task Not Found",
      });
    }

    const isProjectLead = task.project.team_lead === userId;
    const isProjectMember = task.project.members.some(
      (member) => member.userId === userId,
    );

    if (!isProjectLead && !isProjectMember) {
      return res.status(403).json({
        message: "You do not have permission to update this task",
      });
    }

    // Only Project Lead can change title, assignee, or due_date
    if (
      !isProjectLead &&
      (title !== undefined || assigneeId !== undefined || due_date !== undefined)
    ) {
      return res.status(403).json({
        message: "Only the project lead can update task details and assignment",
      });
    }

    // Validate assignee if being changed
    if (assigneeId !== undefined) {
      const isAssigneeMember =
        assigneeId === task.project.team_lead ||
        task.project.members.some((member) => member.userId === assigneeId);

      if (!isAssigneeMember) {
        return res.status(403).json({
          message: "Assignee must be a member of this project",
        });
      }
    }

    // Build update object
    const updateData = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (type !== undefined) {
      updateData.type = type;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (priority !== undefined) {
      updateData.priority = priority;
    }

    if (assigneeId !== undefined) {
      updateData.assigneeId = assigneeId;
    }

    if (due_date !== undefined) {
      const dueDate = new Date(due_date);

      if (Number.isNaN(dueDate.getTime())) {
        return res.status(400).json({
          message: "Invalid due_date",
        });
      }

      updateData.due_date = dueDate;
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: updateData,
      include: {
        assignee: true,
        comments: {
          include: {
            user: true,
          },
        },
        project: true,
      },
    });

    return res.json({
      task: updatedTask,
      message: "Task Updated Successfully",
    });
  } catch (error) {
    console.error("Update Task Error:", error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const taskId =
      req.params.taskId || req.params.id || req.body.taskId || req.body.id;

    if (!taskId) {
      return res.status(400).json({
        message: "taskId is required",
      });
    }

    // Find task
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Find project and its workspace
    const project = await prisma.project.findUnique({
      where: {
        id: task.projectId,
      },
      include: {
        workspace: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Allow project lead, workspace owner, workspace admin, or task assignee
    const isProjectLead = project.team_lead === userId;
    const isWorkspaceOwner = project.workspace?.ownerId === userId;
    const isWorkspaceAdmin = project.workspace?.members.some(
      (m) => m.userId === userId && m.role === "ADMIN",
    );

    if (!isProjectLead && !isWorkspaceOwner && !isWorkspaceAdmin) {
      return res.status(403).json({
        message: "Only the project lead or workspace admin can delete this task",
      });
    }

    // Delete comments for this task first to avoid foreign key errors
    await prisma.comment.deleteMany({
      where: {
        taskId,
      },
    });

    // Delete task
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return res.json({
      message: "Task Deleted Successfully",
      taskId,
    });
  } catch (error) {
    console.error("Delete Task Error:", error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};
