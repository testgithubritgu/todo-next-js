import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const todo = pgTable("todo", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id), // 🔥 relation
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk userId
  email: text("email"),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});
