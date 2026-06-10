"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import {
  resendRegistrationOtp,
  verifyRegistration,
  type FormState,
} from "@/app/actions/auth";
import { Alert, Button, cn } from "@/components/ui";
import { formatNgPhone } from "@/lib/phone";

const LEN = 6;

export function VerifyForm({ phone }: { phone: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    verifyRegistration,
    undefined,
  );
  const [digits, setDigits] = useState<string[]>(Array(LEN).fill(""));
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const code = digits.join("");

  function setAt(i: number, val: string) {
    const v = val.replace(/\D/g, "").slice(-1);
    setDigits((d) => {
      const n = [...d];
      n[i] = v;
      return n;
    });
    if (v && i < LEN - 1) refs.current[i + 1]?.focus();
  }

  function onKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  }

  function onPaste(e: ClipboardEvent<HTMLDivElement>) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LEN);
    if (!text) return;
    e.preventDefault();
    const n = Array(LEN).fill("");
    text.split("").forEach((c, idx) => (n[idx] = c));
    setDigits(n);
    refs.current[Math.min(text.length, LEN - 1)]?.focus();
  }

  return (
    <div className="space-y-5">
      <form action={action} className="space-y-5">
      {state?.error && <Alert variant="error">{state.error}</Alert>}
      <input type="hidden" name="phone" value={phone} />
      <input type="hidden" name="code" value={code} />

      <p className="text-center text-sm text-slate-500">
        We sent a 6-digit code to{" "}
        <span className="font-semibold text-slate-700">{formatNgPhone(phone)}</span>
      </p>

      <div className="flex justify-center gap-2" onPaste={onPaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={d}
            onChange={(e) => setAt(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            className={cn(
              "h-14 w-12 rounded-xl border text-center text-xl font-semibold text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20",
              d ? "border-brand" : "border-slate-300",
            )}
          />
        ))}
      </div>
      {state?.fieldErrors?.code && (
        <p className="text-center text-sm text-red-600">{state.fieldErrors.code[0]}</p>
      )}

      <Button type="submit" disabled={pending || code.length < LEN} className="w-full">
        {pending ? "Verifying…" : "Verify & continue"}
      </Button>
      </form>

      <ResendOtp phone={phone} />
    </div>
  );
}

function ResendOtp({ phone }: { phone: string }) {
  const [state, resend, sending] = useActionState<
    { at: number; failed: boolean },
    FormData
  >(
    async (_prev, fd) => {
      const res = await resendRegistrationOtp(fd);
      return { at: Date.now(), failed: !res.sent };
    },
    { at: 0, failed: false },
  );

  // Countdown derived from an anchor timestamp; ticking `now` avoids
  // synchronously setting state inside an effect body.
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const anchor = state.at || start;
  const secs = Math.max(0, 30 - Math.floor((now - anchor) / 1000));

  return (
    <div className="text-center text-sm">
      {state.failed && (
        <p className="mb-2 text-xs text-red-600">
          We couldn&apos;t send the code. Please try again in a moment.
        </p>
      )}
      {/* Nested actions can't share a parent form, so this is its own form. */}
      <form action={resend}>
        <input type="hidden" name="phone" value={phone} />
        <button
          type="submit"
          disabled={secs > 0 || sending}
          className="font-semibold text-brand transition hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
        >
          {sending ? "Sending…" : "Resend code"}
        </button>
      </form>
      {secs > 0 && (
        <p className="mt-1 text-xs text-slate-400">
          Resend in 0:{secs.toString().padStart(2, "0")}
        </p>
      )}
    </div>
  );
}
