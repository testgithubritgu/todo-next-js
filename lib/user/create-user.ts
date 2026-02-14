import { db } from "@/config/db";
import { users } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";

export const createUser = async () => {
  const user = await currentUser();
  console.log(user)
  if (!user) return;

  await db
    .insert(users)
    .values({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: user.fullName,
    })
    .onConflictDoNothing();
};
