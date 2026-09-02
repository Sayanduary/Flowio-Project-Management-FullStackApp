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

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];
