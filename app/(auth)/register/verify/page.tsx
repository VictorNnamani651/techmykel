import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard, AuthHeader } from "@/components/auth-shell";
import { Icon } from "@/components/icon";
import { isValidNgPhone, normalizeNgPhone } from "@/lib/phone";
import { VerifyForm } from "./verify-form";

export const metadata = { title: "Verify phone — Techmykel" };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone } = await searchParams;
  if (!phone || !isValidNgPhone(phone)) redirect("/register");
  const normalized = normalizeNgPhone(phone) as string;

  return (
    <div>
      <Link
        href="/register"
        className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <Icon name="arrow_back" className="text-[18px]" />
        Back
      </Link>
      <AuthCard>
        <AuthHeader icon="phonelink_lock" title="Enter the code" />
        <VerifyForm phone={normalized} />
      </AuthCard>
    </div>
  );
}
