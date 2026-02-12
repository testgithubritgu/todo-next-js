import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const todo = pgTable("todo", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  task: text("task").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
