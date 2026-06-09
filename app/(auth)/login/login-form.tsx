"use client";

import { useActionState } from "react";
import { login, type FormState } from "@/app/actions/auth";
import { TextField } from "@/components/fields";
import { Alert, Button } from "@/components/ui";
import { Icon } from "@/components/icon";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    login,
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      {state?.error && <Alert variant="error">{state.error}</Alert>}
      <TextField
        name="phone"
        label="Phone number"
        type="tel"
        inputMode="tel"
        icon="call"
        placeholder="0801 234 5678"
        autoComplete="tel"
        required
        error={state?.fieldErrors?.phone}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        icon="key"
        autoComplete="current-password"
        required
        error={state?.fieldErrors?.password}
      />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          "Signing in…"
        ) : (
          <>
            Sign in <Icon name="arrow_forward" className="text-[18px]" />
          </>
        )}
      </Button>
    </form>
  );
}
