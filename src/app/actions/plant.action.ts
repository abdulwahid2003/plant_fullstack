"use server";

import { getSql } from "@/lib/sql";
import { auth } from "@/lib/auth/server";
import type { PlantRecord } from "@/types/plant";

const defaultPlants = [
  {
    name: "Aloe Vera",
    description: "Easy-care succulent for sunny spots.",
    category: "Succulent",
    stock: 20,
    price: 10,
  },
  {
    name: "Monstera Deliciosa",
    description: "Large tropical leaves, great indoors.",
    category: "Tropical",
    stock: 8,
    price: 45,
  },
  {
    name: "Snake Plant",
    description: "Hardy indoor plant with upright leaves.",
    category: "Indoor",
    stock: 3,
    price: 18,
  },
  {
    name: "Fiddle Leaf Fig",
    description: "Statement plant for bright rooms.",
    category: "Indoor",
    stock: 0,
    price: 55,
  },
  {
    name: "Basil",
    description: "Fresh kitchen herb, fast growing.",
    category: "Herb",
    stock: 32,
    price: 6,
  },
  {
    name: "Peace Lily",
    description: "Flowering plant that tolerates shade.",
    category: "Flowering",
    stock: 5,
    price: 22,
  },
];

async function fetchPlants(userId: string): Promise<PlantRecord[]> {
  const sql = getSql();

  return sql`
    SELECT
      id,
      name,
      description,
      category,
      stock,
      price,
      "imageUrl"
    FROM "Plant"
    WHERE "userId" = ${userId}
    ORDER BY "createdAt" DESC
  `;
}

async function seedPlantsForUser(userId: string) {
  const sql = getSql();

  for (const plant of defaultPlants) {
    await sql`
      INSERT INTO "Plant" (
        id,
        name,
        description,
        category,
        stock,
        price,
        "userId",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        gen_random_uuid()::text,
        ${plant.name},
        ${plant.description},
        ${plant.category},
        ${plant.stock},
        ${plant.price},
        ${userId},
        NOW(),
        NOW()
      )
    `;
  }
}

export async function getPlants(): Promise<PlantRecord[]> {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return [];
  }

  const userId = session.user.id;
  let plants = await fetchPlants(userId);

  if (plants.length === 0) {
    await seedPlantsForUser(userId);
    plants = await fetchPlants(userId);
  }

  return plants;
}
