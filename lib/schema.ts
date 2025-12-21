
import { pgTable, text, serial, timestamp, uuid } from "drizzle-orm/pg-core";

export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  userName: text("user_name").notNull(),
  itemName: text("item_name").notNull(),
  quantity: text("quantity").notNull(), // e.g. "2 bottles", "500g"
  note: text("note"), // optional note
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  key: text("key").notNull(), // uploadthing key
  uploaderName: text("uploader_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
