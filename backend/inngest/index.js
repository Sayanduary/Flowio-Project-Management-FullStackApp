import { Inngest } from "inngest";
import prisma from "../config/db.js";

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
    triggers: {
      event: "clerk/user.created",
    },
  },
  async ({ event }) => {
    try {
      const { data } = event;

      const email = data.email_addresses?.[0]?.email_address || "";

      const name = `${data?.first_name || ""} ${data?.last_name || ""}`.trim();

      if (!data.id || !email || !name) {
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
    triggers: {
      event: "clerk/user.updated",
    },
  },
  async ({ event }) => {
    try {
      const { data } = event;

      const email = data.email_addresses?.[0]?.email_address || "";

      const name = `${data?.first_name || ""} ${data?.last_name || ""}`.trim();

      if (!data.id || !email || !name) {
        console.warn("Missing required user data:", {
          id: data?.id,
          email,
          name,
        });

        return;
      }

      await prisma.user
        .update({
          where: {
            id: data.id,
          },

          data: {
            email,
            name,
            image: data?.image_url || "",
          },
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
    triggers: {
      event: "clerk/user.deleted",
    },
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
| Creates:
| 1. Workspace
| 2. Creator as ADMIN
|
| Nested write keeps both operations atomic without
| using an interactive Prisma transaction.
|
*/

const syncWorkspaceCreation = inngest.createFunction(
  {
    id: "sync-workspace-from-clerk",
    triggers: {
      event: "clerk/organization.created",
    },
  },
  async ({ event }) => {
    try {
      const { data } = event;

      console.log("Creating workspace:", data);

      if (!data.id || !data.name || !data.slug || !data.created_by) {
        throw new Error(
          `Invalid organization.created payload: ${JSON.stringify(data)}`,
        );
      }

      const workspace = await prisma.workspace.create({
        data: {
          id: data.id,
          name: data.name,
          slug: data.slug,
          ownerId: data.created_by,
          image_url: data.image_url || "",

          members: {
            create: {
              userId: data.created_by,
              role: "ADMIN",
            },
          },
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
    triggers: {
      event: "clerk/organization.updated",
    },
  },
  async ({ event }) => {
    try {
      const { data } = event;

      if (!data.id) {
        throw new Error(
          `Invalid organization.updated payload: ${JSON.stringify(data)}`,
        );
      }

      await prisma.workspace
        .update({
          where: {
            id: data.id,
          },

          data: {
            name: data.name,
            slug: data.slug,
            image_url: data.image_url || "",
          },
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
    triggers: {
      event: "clerk/organization.deleted",
    },
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
| Clerk event:
| organization_membership.created
|
| The membership payload contains the organization,
| public user data, and role.
|
*/

const syncWorkspaceMemberCreation = inngest.createFunction(
  {
    id: "sync-workspace-member-from-clerk",
    triggers: {
      event: "clerk/organization_membership.created",
    },
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
          `Invalid organization_membership.created payload: ${JSON.stringify(
            data,
          )}`,
        );
      }

      const role = String(clerkRole).toLowerCase().includes("admin")
        ? "ADMIN"
        : "MEMBER";

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
];
