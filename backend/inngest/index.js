import { Inngest } from "inngest";
import prisma from "../config/db.js";
import sendEmail from "../utils/nodemailer.js";

// Production Inngest client
export const inngest = new Inngest({
  id: "project-management",
});

/*
|--------------------------------------------------------------------------
| USER CREATED
|--------------------------------------------------------------------------
*/

const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      const email =
        data.email_addresses?.[0]?.email_address || data.email || "";

      const rawName =
        `${data?.first_name || ""} ${data?.last_name || ""}`.trim();
      const name =
        rawName ||
        data?.username ||
        (email ? email.split("@")[0] : "") ||
        "User";

      if (!data.id || !email) {
        console.warn("Missing required user data:", {
          id: data?.id,
          email,
          name,
        });

        return;
      }

      await prisma.user.upsert({
        where: {
          id: data.id,
        },

        create: {
          id: data.id,
          email,
          name,
          image: data?.image_url || "",
        },

        update: {
          email,
          name,
          image: data?.image_url || "",
        },
      });

      console.log("User synced successfully:", data.id);
    } catch (error) {
      console.error("Error in syncUserCreation:", error);
      throw error;
    }
  },
);

/*
|--------------------------------------------------------------------------
| USER UPDATED
|--------------------------------------------------------------------------
*/

const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      const email =
        data.email_addresses?.[0]?.email_address || data.email || "";

      const rawName =
        `${data?.first_name || ""} ${data?.last_name || ""}`.trim();
      const name =
        rawName || data?.username || (email ? email.split("@")[0] : "");

      if (!data.id) {
        console.warn("Missing required user id for update");
        return;
      }

      const updateData = {
        image: data?.image_url || "",
      };

      if (email) updateData.email = email;
      if (name) updateData.name = name;

      await prisma.user
        .update({
          where: {
            id: data.id,
          },

          data: updateData,
        })
        .catch((error) => {
          if (error.code === "P2025") {
            console.warn(`User ${data.id} does not exist for update`);
            return;
          }

          throw error;
        });

      console.log("User updated successfully:", data.id);
    } catch (error) {
      console.error("Error in syncUserUpdation:", error);
      throw error;
    }
  },
);

/*
|--------------------------------------------------------------------------
| USER DELETED
|--------------------------------------------------------------------------
*/

const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      await prisma.user
        .delete({
          where: {
            id: data.id,
          },
        })
        .catch((error) => {
          if (error.code === "P2025") {
            console.warn(`User ${data.id} does not exist for deletion`);
            return;
          }

          throw error;
        });

      console.log("User deleted successfully:", data.id);
    } catch (error) {
      console.error("Error in syncUserDeletion:", error);
      throw error;
    }
  },
);

/*
|--------------------------------------------------------------------------
| WORKSPACE CREATED
|--------------------------------------------------------------------------
|
| Clerk organization.created
|
| Creates or updates:
| 1. Workspace
| 2. Creator as ADMIN
|
*/

const syncWorkspaceCreation = inngest.createFunction(
  {
    id: "sync-workspace-from-clerk",
    triggers: [{ event: "clerk/organization.created" }],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      console.log("Creating workspace:", data);

      const ownerId = data.created_by || data.user_id;

      if (!data.id || !data.name || !ownerId) {
        throw new Error(
          `Invalid organization.created payload: ${JSON.stringify(data)}`,
        );
      }

      // Slugs are disabled by default in Clerk; generate a fallback slug if null or empty
      const baseSlug = (data.slug || data.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const slug =
        data.slug || `${baseSlug || "workspace"}-${data.id.slice(-6)}`;

      // Ensure the owner exists in the User table to satisfy the foreign key constraint
      const existingUser = await prisma.user.findUnique({
        where: { id: ownerId },
      });

      if (!existingUser) {
        console.warn(
          `Owner user ${ownerId} not found in DB. Creating placeholder user record.`,
        );
        await prisma.user.create({
          data: {
            id: ownerId,
            name: "Workspace Owner",
            email: `${ownerId}@clerk.placeholder`,
            image: "",
          },
        });
      }

      // Upsert workspace to ensure idempotency
      const workspace = await prisma.workspace.upsert({
        where: {
          id: data.id,
        },
        update: {
          name: data.name,
          slug,
          image_url: data.image_url || "",
        },
        create: {
          id: data.id,
          name: data.name,
          slug,
          ownerId,
          image_url: data.image_url || "",
          members: {
            create: {
              userId: ownerId,
              role: "ADMIN",
            },
          },
        },
      });

      // Ensure creator is recorded as ADMIN in WorkspaceMember
      await prisma.workspaceMember.upsert({
        where: {
          userId_workspaceId: {
            userId: ownerId,
            workspaceId: workspace.id,
          },
        },
        update: {
          role: "ADMIN",
        },
        create: {
          userId: ownerId,
          workspaceId: workspace.id,
          role: "ADMIN",
        },
      });

      console.log("Workspace created successfully:", workspace.id);

      return {
        success: true,
        workspaceId: workspace.id,
      };
    } catch (error) {
      console.error("Error in syncWorkspaceCreation:", error);
      throw error;
    }
  },
);

/*
|--------------------------------------------------------------------------
| WORKSPACE UPDATED
|--------------------------------------------------------------------------
*/

const syncWorkspaceUpdation = inngest.createFunction(
  {
    id: "update-workspace-from-clerk",
    triggers: [{ event: "clerk/organization.updated" }],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      if (!data.id) {
        throw new Error(
          `Invalid organization.updated payload: ${JSON.stringify(data)}`,
        );
      }

      const updateData = {
        name: data.name,
        image_url: data.image_url || "",
      };

      if (data.slug) {
        updateData.slug = data.slug;
      }

      await prisma.workspace
        .update({
          where: {
            id: data.id,
          },
          data: updateData,
        })
        .catch((error) => {
          if (error.code === "P2025") {
            console.warn(`Workspace ${data.id} does not exist for update`);
            return;
          }

          throw error;
        });

      console.log("Workspace updated successfully:", data.id);
    } catch (error) {
      console.error("Error in syncWorkspaceUpdation:", error);
      throw error;
    }
  },
);

/*
|--------------------------------------------------------------------------
| WORKSPACE DELETED
|--------------------------------------------------------------------------
*/

const syncWorkspaceDeletion = inngest.createFunction(
  {
    id: "delete-workspace-with-clerk",
    triggers: [{ event: "clerk/organization.deleted" }],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      await prisma.workspace
        .delete({
          where: {
            id: data.id,
          },
        })
        .catch((error) => {
          if (error.code === "P2025") {
            console.warn(`Workspace ${data.id} does not exist for deletion`);
            return;
          }

          throw error;
        });

      console.log("Workspace deleted successfully:", data.id);
    } catch (error) {
      console.error("Error in syncWorkspaceDeletion:", error);
      throw error;
    }
  },
);

/*
|--------------------------------------------------------------------------
| WORKSPACE MEMBER CREATED
|--------------------------------------------------------------------------
|
| Handles both camelCase and snake_case Clerk events
|
*/

const syncWorkspaceMemberCreation = inngest.createFunction(
  {
    id: "sync-workspace-member-from-clerk",
    triggers: [
      { event: "clerk/organizationMembership.created" },
      { event: "clerk/organization_membership.created" },
    ],
  },
  async ({ event }) => {
    try {
      const { data } = event;

      console.log("Creating workspace member:", data);

      const userId =
        data.public_user_data?.user_id ||
        data.publicUserData?.userId ||
        data.user_id;

      const workspaceId = data.organization?.id || data.organization_id;

      const clerkRole = data.role || data.role_name || "";

      if (!userId || !workspaceId) {
        throw new Error(
          `Invalid organization membership payload: ${JSON.stringify(data)}`,
        );
      }

      const role = String(clerkRole).toLowerCase().includes("admin")
        ? "ADMIN"
        : "MEMBER";

      // Ensure user exists before adding membership
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        console.warn(
          `User ${userId} not found in DB. Creating placeholder user.`,
        );
        await prisma.user.create({
          data: {
            id: userId,
            name:
              `${data.public_user_data?.first_name || ""} ${data.public_user_data?.last_name || ""}`.trim() ||
              "Member",
            email:
              data.public_user_data?.identifier ||
              `${userId}@clerk.placeholder`,
            image: data.public_user_data?.image_url || "",
          },
        });
      }

      // Ensure workspace exists before adding membership
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
      });

      if (!workspace) {
        console.warn(
          `Workspace ${workspaceId} not found for member creation. Skipping.`,
        );
        return;
      }

      await prisma.workspaceMember.upsert({
        where: {
          userId_workspaceId: {
            userId,
            workspaceId,
          },
        },
        update: {
          role,
        },
        create: {
          userId,
          workspaceId,
          role,
        },
      });

      console.log("Workspace member synced successfully:", {
        userId,
        workspaceId,
        role,
      });
    } catch (error) {
      console.error("Error in syncWorkspaceMemberCreation:", error);
      throw error;
    }
  },
);

// Ingest Function to send Email on Task Creation

const sendTaskAssignmentEmail = inngest.createFunction(
  {
    id: "send-task-assignment-email",
    triggers: {
      event: "app/task.assigned",
    },
  },

  async ({ event, step }) => {
    try {
      const { taskId, origin } = event.data;

      if (!taskId) {
        throw new Error("taskId is required");
      }

      // ==========================================
      // Get task
      // ==========================================
      const task = await prisma.task.findUnique({
        where: {
          id: taskId,
        },
        include: {
          assignee: true,
          project: true,
        },
      });

      if (!task) {
        throw new Error(`Task ${taskId} not found`);
      }

      if (!task.assignee) {
        throw new Error(`Task ${taskId} does not have an assignee`);
      }

      // ==========================================
      // Task URL
      // ==========================================
      const taskUrl = origin ? `${origin}/tasks/${task.id}` : "";

      // ==========================================
      // Send assignment email
      // ==========================================
      await step.run("send-task-assignment-email", async () => {
        await sendEmail({
          to: task.assignee.email,

          subject: `New Task Assignment - ${task.title}`,

          body: `
Hi ${task.assignee.name},

You have been assigned a new task.

Task: ${task.title}
Project: ${task.project.name}
Priority: ${task.priority}
Status: ${task.status}
Due Date: ${new Date(task.due_date).toLocaleDateString()}

${
  task.description
    ? `Description:
${task.description}`
    : ""
}

${
  taskUrl
    ? `View Task:
${taskUrl}`
    : ""
}

Please make sure to review and complete the task before the due date.

Best regards,
Flowio Team
            `,
        });
      });

      // ==========================================
      // Wait until due date
      // ==========================================
      const dueDate = new Date(task.due_date);

      if (dueDate > new Date()) {
        await step.sleepUntil("wait-for-the-due-date", dueDate);
      }

      // ==========================================
      // Check task again after waiting
      // ==========================================
      await step.run("check-if-task-is-completed", async () => {
        const currentTask = await prisma.task.findUnique({
          where: {
            id: taskId,
          },
          include: {
            assignee: true,
            project: true,
          },
        });

        if (!currentTask) {
          console.log(`Task ${taskId} no longer exists`);
          return;
        }

        // ==========================================
        // Send reminder only if not completed
        // ==========================================
        if (currentTask.status !== "DONE") {
          await sendEmail({
            to: currentTask.assignee.email,

            subject: `Task Due - ${currentTask.title}`,

            body: `
Hi ${currentTask.assignee.name},

Your task "${currentTask.title}" is due today.

Project: ${currentTask.project.name}
Priority: ${currentTask.priority}
Status: ${currentTask.status}
Due Date: ${new Date(currentTask.due_date).toLocaleDateString()}

${
  currentTask.description
    ? `Description:
${currentTask.description}`
    : ""
}

${
  taskUrl
    ? `View Task:
${taskUrl}`
    : ""
}

Please make sure to review and complete it.

Best regards,
Flowio Team
              `,
          });

          console.log(`Due-date reminder sent for task ${taskId}`);
        } else {
          console.log(`Task ${taskId} is already completed. No reminder sent.`);
        }
      });

      return {
        success: true,
        taskId,
      };
    } catch (error) {
      console.error("Task Assignment Email Error:", error);

      throw error;
    }
  },
);
/*
|--------------------------------------------------------------------------
| EXPORT FUNCTIONS
|--------------------------------------------------------------------------
*/

export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,

  syncWorkspaceCreation,
  syncWorkspaceUpdation,
  syncWorkspaceDeletion,

  syncWorkspaceMemberCreation,
  sendTaskAssignmentEmail,
];
