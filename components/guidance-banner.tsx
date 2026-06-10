import { Alert } from "@/components/ui";
import { REFERRAL_GUIDANCE, REDEMPTION_GUIDANCE } from "@/lib/referrer-labels";

// Persistent, status-aware explanation of where a referral or redemption
// stands and what happens next. Pure function of status — rendered on every
// load of the detail surfaces, no flash mechanism needed.
export function GuidanceBanner({
  kind,
  status,
}: {
  kind: "referral" | "redemption";
  status: string;
}) {
  const guidance =
    kind === "referral" ? REFERRAL_GUIDANCE[status] : REDEMPTION_GUIDANCE[status];
  if (!guidance) return null;
  return <Alert variant={guidance.variant}>{guidance.text}</Alert>;
}
