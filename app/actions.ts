"use server";

import { db } from "@/lib/db";
import { contributions, photos } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addContribution(userName: string, itemName: string, quantity: string, note?: string) {
  if (!userName || !itemName || !quantity) return { success: false, error: "Missing fields" };
  
  await db.insert(contributions).values({
    userName,
    itemName,
    quantity,
    note: note || null,
  });
  
  revalidatePath("/");
  revalidatePath("/summary");
  return { success: true };
}

export async function deleteContribution(id: number) {
  await db.delete(contributions).where(eq(contributions.id, id));
  revalidatePath("/");
  revalidatePath("/summary");
  revalidatePath("/summary");
  return { success: true };
}

export async function updateContribution(id: number, userName: string, itemName: string, quantity: string, note?: string) {
  if (!userName || !itemName || !quantity) return { success: false, error: "Missing fields" };

  await db.update(contributions)
    .set({
      itemName,
      quantity,
      note: note || null,
    })
    .where(eq(contributions.id, id));

  revalidatePath("/");
  revalidatePath("/summary");
  return { success: true };
}

export async function getContributions() {
  const data = await db.select().from(contributions).orderBy(desc(contributions.createdAt));
  return data;
}

export async function addPhoto(url: string, key: string, uploaderName: string) {
  await db.insert(photos).values({
    url,
    key,
    uploaderName,
  });
  revalidatePath("/gallery");
}

export async function getPhotos() {
  return await db.select().from(photos).orderBy(desc(photos.createdAt));
}
