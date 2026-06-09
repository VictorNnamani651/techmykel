import "server-only";
import { db } from "@/lib/db";
import { auditLog } from "@/lib/db/schema";

interface AuditInput {
  actorUserId?: string | null;
  actorRole?: string | null;
  action: string;
  entityType: "referral" | "redemption";
  entityId: string;
  fromState?: string | null;
  toState?: string | null;
  metadata?: Record<string, unknown> | null;
}

// Append-only write (ADR-0003). There is intentionally no update/delete helper.
export async function writeAudit(e: AuditInput): Promise<void> {
  await db.insert(auditLog).values({
    actorUserId: e.actorUserId ?? null,
    actorRole: e.actorRole ?? null,
    action: e.action,
    entityType: e.entityType,
    entityId: e.entityId,
    fromState: e.fromState ?? null,
    toState: e.toState ?? null,
    metadata: e.metadata ?? null,
  });
}
