import Link from "next/link";
import { AuthCard, AuthHeader } from "@/components/auth-shell";
import { RegisterForm } from "./register-form";

export const metadata = { title: "Create account — Techmykel" };

export default function RegisterPage() {
  return (
    <AuthCard>
      <AuthHeader
        icon="person_add"
        title="Create your account"
        subtitle="Join Techmykel and start earning on referrals."
      />
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
