import prisma from "../config/db.js";

// ==========================================
// CREATE PROJECT
// Workspace ADMIN only
// ==========================================
export const createProject = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const {
      workspaceId,
      description,
      name,
      status,
      start_date,
      end_date,
      team_members,
      team_lead,
      progress,
      priority,
    } = req.body;

    // Validate required fields
    if (!workspaceId || !name || !team_lead) {
      return res.status(400).json({
        message: "workspaceId, name and team_lead are required",
      });
    }

    // Find workspace and its members
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace Not Found",
      });
    }

    // Check if logged-in user is workspace admin
    const isAdmin = workspace.members.some(
      (member) => member.userId === userId && member.role === "ADMIN",
    );

    if (!isAdmin) {
      return res.status(403).json({
        message:
          "You do not have permission to create projects in this workspace",
      });
    }

    // Find team lead from workspace members
    const teamLead = workspace.members.find(
      (member) => member.user.email === team_lead,
    );

    if (!teamLead) {
      return res.status(400).json({
        message: "Team lead must be a member of the workspace",
      });
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        workspaceId,
        name,
        description: description || null,
        status: status || "ACTIVE",
        priority: priority || "MEDIUM",
        progress: progress ?? 0,
        team_lead: teamLead.userId,

        start_date: start_date ? new Date(start_date) : null,

        end_date: end_date ? new Date(end_date) : null,
      },
    });

    // Add project members (including team lead)
    const membersToInclude = Array.isArray(team_members)
      ? [...team_members]
      : [];
    if (!membersToInclude.includes(team_lead)) {
      membersToInclude.push(team_lead);
    }

    const membersToAdd = workspace.members
      .filter((member) => membersToInclude.includes(member.user.email))
      .map((member) => ({
        projectId: project.id,
        userId: member.userId,
      }));

    if (membersToAdd.length > 0) {
      await prisma.projectMember.createMany({
        data: membersToAdd,
        skipDuplicates: true,
      });
    }

    // Get complete project
    const projectWithMembers = await prisma.project.findUnique({
      where: {
        id: project.id,
      },
      include: {
        owner: true,

        members: {
          include: {
            user: true,
          },
        },

        tasks: {
          include: {
            assignee: true,

            comments: {
              include: {
                user: true,
              },
            },
          },
        },

        workspace: true,
      },
    });

    return res.status(201).json({
      project: projectWithMembers,
      message: "Project Created Successfully",
    });
  } catch (error) {
    console.error("Create Project Error:", error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};

// ==========================================
// UPDATE PROJECT
// Project Lead only
// ==========================================
export const updateProject = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const projectId =
      req.params.projectId || req.params.id || req.body.projectId || req.body.id;

    if (!projectId) {
      return res.status(400).json({
        message: "projectId is required",
      });
    }

    const {
      name,
      description,
      status,
      priority,
      start_date,
      end_date,
      progress,
      team_lead,
    } = req.body;

    // Find project
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
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
        message: "Project Not Found",
      });
    }

    // Check permissions: Project Lead, Workspace Owner, or Workspace Admin
    const isProjectLead = project.team_lead === userId;
    const isWorkspaceOwner = project.workspace?.ownerId === userId;
    const isWorkspaceAdmin = project.workspace?.members.some(
      (m) => m.userId === userId && m.role === "ADMIN",
    );

    if (!isProjectLead && !isWorkspaceOwner && !isWorkspaceAdmin) {
      return res.status(403).json({
        message: "Only the project lead or workspace admin can update this project",
      });
    }

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (priority !== undefined) {
      updateData.priority = priority;
    }

    if (progress !== undefined) {
      updateData.progress = progress;
    }

    if (start_date !== undefined) {
      updateData.start_date = start_date ? new Date(start_date) : null;
    }

    if (end_date !== undefined) {
      updateData.end_date = end_date ? new Date(end_date) : null;
    }

    // Change project lead
    if (team_lead !== undefined) {
      const newTeamLead = await prisma.user.findUnique({
        where: {
          email: team_lead,
        },
        select: {
          id: true,
        },
      });

      if (!newTeamLead) {
        return res.status(404).json({
          message: "New project lead not found",
        });
      }

      // New lead must belong to workspace
      const isWorkspaceMember = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: project.workspaceId,
          userId: newTeamLead.id,
        },
      });

      if (!isWorkspaceMember) {
        return res.status(400).json({
          message: "New project lead must be a member of the workspace",
        });
      }

      updateData.team_lead = newTeamLead.id;
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: updateData,

      include: {
        owner: true,

        members: {
          include: {
            user: true,
          },
        },

        tasks: {
          include: {
            assignee: true,

            comments: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return res.json({
      project: updatedProject,
      message: "Project Updated Successfully",
    });
  } catch (error) {
    console.error("Update Project Error:", error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};

// ==========================================
// ADD MEMBER TO PROJECT
// Project Lead only
// ==========================================
export const addMember = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const projectId =
      req.params.projectId || req.params.id || req.body.projectId;

    if (!projectId) {
      return res.status(400).json({
        message: "projectId is required",
      });
    }

    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({
        message: "memberId is required",
      });
    }

    // Find project
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
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
        message: "Project Not Found",
      });
    }

    // Only project lead can add members
    if (project.team_lead !== userId) {
      return res.status(403).json({
        message: "Only the project lead can add members",
      });
    }

    // Check user exists
    const user = await prisma.user.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    // User must belong to workspace
    const isWorkspaceMember = project.workspace.members.some(
      (member) => member.userId === memberId,
    );

    if (!isWorkspaceMember) {
      return res.status(400).json({
        message:
          "User must be a member of the workspace before being added to the project",
      });
    }

    // Add project member
    const projectMember = await prisma.projectMember.create({
      data: {
        projectId,
        userId: memberId,
      },

      include: {
        user: true,
      },
    });

    return res.status(201).json({
      member: projectMember,
      message: "Member Added Successfully",
    });
  } catch (error) {
    console.error("Add Project Member Error:", error);

    // Already a project member
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "User is already a member of this project",
      });
    }

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};

// ==========================================
// DELETE PROJECT
// Project Lead or Workspace Admin/Owner
// ==========================================
export const deleteProject = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const projectId =
      req.params.projectId || req.params.id || req.body.projectId || req.body.id;

    if (!projectId) {
      return res.status(400).json({
        message: "projectId is required",
      });
    }

    // Find project and workspace
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        workspace: {
          include: {
            members: true,
          },
        },
        tasks: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project Not Found",
      });
    }

    // Check permissions: Project Lead, Workspace Owner, or Workspace Admin
    const isProjectLead = project.team_lead === userId;
    const isWorkspaceOwner = project.workspace.ownerId === userId;
    const isWorkspaceAdmin = project.workspace.members.some(
      (m) => m.userId === userId && m.role === "ADMIN",
    );

    if (!isProjectLead && !isWorkspaceOwner && !isWorkspaceAdmin) {
      return res.status(403).json({
        message: "Only the project lead or workspace admin can delete this project",
      });
    }

    // Clean up task comments first if tasks exist
    const taskIds = project.tasks.map((t) => t.id);
    if (taskIds.length > 0) {
      await prisma.comment.deleteMany({
        where: {
          taskId: { in: taskIds },
        },
      });
    }

    // Delete tasks
    await prisma.task.deleteMany({
      where: {
        projectId,
      },
    });

    // Delete project members
    await prisma.projectMember.deleteMany({
      where: {
        projectId,
      },
    });

    // Delete project
    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return res.json({
      message: "Project Deleted Successfully",
      projectId,
    });
  } catch (error) {
    console.error("Delete Project Error:", error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};
