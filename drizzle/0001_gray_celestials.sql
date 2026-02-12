CREATE TABLE "todo" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"task" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;