import prisma from "../config/db.js";

// Add Comment
export const addComment = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const { taskId, content } = req.body;

    if (!taskId || !content?.trim()) {
      return res.status(400).json({
        message: "taskId and content are required",
      });
    }

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
        message: "Task not found",
      });
    }

    const isProjectMember = task.project.members.some(
      (member) => member.userId === userId,
    );

    const isProjectLead = task.project.team_lead === userId;

    if (!isProjectMember && !isProjectLead) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        taskId,
        userId,
      },
      include: {
        user: true,
      },
    });

    return res.status(201).json({
      comment,
      message: "Comment Added Successfully",
    });
  } catch (error) {
    console.error("Add Comment Error:", error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};

// Get Task Comments
export const getTaskComments = async (req, res) => {
  try {
    const { userId } = await req.auth();

    const { taskId } = req.params;

    // Find task and project members
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
        message: "Task not found",
      });
    }

    // Check project access
    const isProjectMember = task.project.members.some(
      (member) => member.userId === userId,
    );

    const isProjectLead = task.project.team_lead === userId;

    if (!isProjectMember && !isProjectLead) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    // Get comments
    const comments = await prisma.comment.findMany({
      where: {
        taskId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.json({
      comments,
      message: "Task Comments Fetched Successfully",
    });
  } catch (error) {
    console.error("Get Task Comments Error:", error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};
