"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/dal";
import { markAllRead } from "@/lib/notifications";

export async function markNotificationsRead(): Promise<void> {
  const session = await requireUser();
  await markAllRead(session.userId);
  revalidatePath("/notifications");
}
