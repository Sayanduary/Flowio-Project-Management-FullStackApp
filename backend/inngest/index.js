import { Inngest } from "inngest";
import prisma from "../config/db.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-management" });

// Inngest Function to save user data to a database

const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: { event: "clerk/user.created" },
  },
  async ({ event }) => {
    try {
      const { data } = event;
      const email = data.email_addresses?.[0]?.email_address || "";
      const name = `${data?.first_name || ""} ${data?.last_name || ""}`.trim();

      if (!email || !name) {
        console.warn("Missing required user data", { email, name });
        return;
      }

      await prisma.user.upsert({
        where: { id: data.id },
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
    } catch (error) {
      console.error("Error in syncUserCreation:", error);
      throw error;
    }
  },
);

const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    triggers: { event: "clerk/user.deleted" },
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
            console.warn(`User ${data.id} not found for deletion`);
            return;
          }
          throw error;
        });
    } catch (error) {
      console.error("Error in syncUserDeletion:", error);
      throw error;
    }
  },
);

const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: { event: "clerk/user.updated" },
  },
  async ({ event }) => {
    try {
      const { data } = event;
      const email = data.email_addresses?.[0]?.email_address || "";
      const name = `${data?.first_name || ""} ${data?.last_name || ""}`.trim();

      if (!email || !name) {
        console.warn("Missing required user data", { email, name });
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
            console.warn(`User ${data.id} not found for update`);
            return;
          }
          throw error;
        });
    } catch (error) {
      console.error("Error in syncUserUpdation:", error);
      throw error;
    }
  },
);

const syncWorkspaceCreation = inngest.createFunction(
  {
    id: "sync-workspace-from-clerk",
  },
  { event: "clerk/organization.created" },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.create({
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        owner: data.created_by,
        image_url: data.image_url,
      },
    });
    // Add creator as ADMIN member
    await prisma.workspaceMember.create({
      data: { userId: data.created_by, workspaceId: data.id, role: "ADMIN" },
    });
  },
);

// Ingest Fucntion to update workspace data in database

const syncWorkspaceUpdation = inngest.createFunction(
  {
    id: "update-workspace-from-clerk",
  },
  { event: "clerk/organization.updated" },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug: data.slug,
        owner: data.created_by,
        image_url: data.image_url,
      },
    });
  },
);

// ingest function to delete workspace from database

const syncWorkspaceDeletion = inngest.createFunction(
  {
    id: "delete-workspace-with-clerk",
  },
  { event: "clerk/organization.deleted" },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.delete({
      where: {
        id: data.id,
      },
    });
  },
);

//inngest function to save workspace member data to a database

const syncWorkspaceMemnerCreation = inngest.createFunction(
  {
    id: "sync-workspace-member-from-clerk",
  },
  { event: "clerk/organizationInvitation.accepted" },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspaceMember.create({
      data: {
        userId: data.user_id,
        workspaceId: data.organization_id,
        role: String(data.role_name).toUpperCase(),
      },
    });
  },
);

// Create an empty array where we'll export future Inngest functions
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  syncWorkspaceCreation,
  syncWorkspaceUpdation,
  syncWorkspaceDeletion,
  syncWorkspaceMemnerCreation,
];
