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

export async function addPhoto(url: string, key: string, uploaderName: string, mediaType: "image" | "video" = "image", thumbnailUrl?: string) {
  await db.insert(photos).values({
    url,
    key,
    uploaderName,
    mediaType,
    thumbnailUrl,
  });
  revalidatePath("/gallery");
}

export async function deletePhoto(id: number, userName: string) {
  const photo = await db.query.photos.findFirst({
    where: eq(photos.id, id),
  });

  if (!photo) return { success: false, error: "Photo not found" };

  if (photo.uploaderName !== userName) {
    return { success: false, error: "You can only delete your own photos" };
  }

  const timeDiff = Date.now() - photo.createdAt.getTime();
  if (timeDiff > 15 * 60 * 1000) {
    // 15 minutes
    return { success: false, error: "Cannot delete photos older than 15 minutes" };
  }

  await db.delete(photos).where(eq(photos.id, id));
  revalidatePath("/gallery");
  return { success: true };
}

export async function getPhotos() {
  return await db.select().from(photos).orderBy(desc(photos.createdAt));
}
