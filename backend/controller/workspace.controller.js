import prisma from "../config/db.js";

// Get all workspaces for the current user
export const getUserWorkspaces = async (req, res) => {
  try {
    const { userId } = await req.auth();

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },

        projects: {
          include: {
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
        },

        owner: true,
      },
    });

    return res.json({
      workspaces,
    });
  } catch (error) {
    console.error("Get Workspaces Error:", error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};

// Add member to workspace
export const addMember = async (req, res) => {
  try {
    const { userId } = await req.auth();

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { email, role, workspaceId, message } = req.body;

    // Validate required fields
    if (!email || !workspaceId || !role) {
      return res.status(400).json({
        message: "Missing Required Parameters",
      });
    }

    // Validate role
    if (!["ADMIN", "MEMBER"].includes(role)) {
      return res.status(400).json({
        message: "Invalid Role",
      });
    }

    // Find the user we want to add
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    // Find workspace
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        members: true,
      },
    });

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace Not Found",
      });
    }

    // Check whether current user is an ADMIN
    const isAdmin = workspace.members.some(
      (member) => member.userId === userId && member.role === "ADMIN",
    );

    if (!isAdmin) {
      return res.status(403).json({
        message: "You do not have admin privileges",
      });
    }

    // Check whether target user is already a member
    const existingMember = workspace.members.find(
      (member) => member.userId === user.id,
    );

    if (existingMember) {
      return res.status(409).json({
        message: "User is already a member",
      });
    }

    // Create workspace membership
    const member = await prisma.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId,
        role,
        message: message || "",
      },
    });

    return res.status(201).json({
      member,
      message: "Member Added Successfully",
    });
  } catch (error) {
    console.error("Add Member Error:", error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};
