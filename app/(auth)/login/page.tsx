import Link from "next/link";
import { AuthCard, AuthHeader } from "@/components/auth-shell";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in — Techmykel" };

export default function LoginPage() {
  return (
    <AuthCard>
      <AuthHeader
        icon="lock"
        title="Sign in"
        subtitle="Access your Techmykel Rewards account."
      />
      <LoginForm />
      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <Link href="/register" className="font-semibold text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}
