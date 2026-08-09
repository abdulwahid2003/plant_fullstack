"use server";

import { neon } from "@neondatabase/serverless";

export type UserDetails = {
  id: string;
  email: string;
  name: string;
  image: string | null;
};

export async function getUserDetails(
  userId: string
): Promise<UserDetails | null> {
    try {
        if (!process.env.DATABASE_URL) {
    throw new Error("Database URL is not configured");
  }
  if (!userId) {
    return null;
  }

  const sql = neon(process.env.DATABASE_URL);
  const users = await sql`
    SELECT id, email, name, image
    FROM neon_auth.user
    WHERE id = ${userId}
    LIMIT 1
  `;
  console.log("users[0] ?? null;",users[0] ?? null);
  return users[0] ?? null;
    } catch (error) {
        console.log("Error fetching user details:", error);
    }
  
}
