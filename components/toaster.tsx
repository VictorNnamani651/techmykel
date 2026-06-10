"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TOAST_MESSAGES, type GuidanceVariant } from "@/lib/referrer-labels";
import { Icon } from "@/components/icon";
import { cn } from "@/components/ui";

const STYLES: Record<GuidanceVariant, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
};
const ICONS: Record<GuidanceVariant, string> = {
  info: "info",
  success: "check_circle",
  error: "error",
};

type Toast = { variant: GuidanceVariant; text: string };

// Reads a one-shot ?toast= marker left by a server action's redirect, surfaces
// the message, then strips the marker from the URL so a refresh won't replay it.
export function Toaster() {
  const params = useSearchParams();
  const key = params.get("toast");
  const [toast, setToast] = useState<Toast | null>(null);
  // Track the last marker we reacted to. Storing the previous value in state and
  // adjusting during render is React's recommended alternative to setState in an
  // effect. Resets to null when the param is absent, so a later action with the
  // same key surfaces again.
  const [handledKey, setHandledKey] = useState<string | null>(null);

  if (key !== handledKey) {
    setHandledKey(key);
    setToast(key ? (TOAST_MESSAGES[key] ?? null) : null);
  }

  // Once a toast is showing: drop the marker from the address bar (no
  // navigation) and auto-dismiss after a few seconds.
  useEffect(() => {
    if (!toast) return;
    const url = new URL(window.location.href);
    if (url.searchParams.has("toast")) {
      url.searchParams.delete("toast");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4">
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "pointer-events-auto flex items-start gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg",
          STYLES[toast.variant],
        )}
      >
        <Icon name={ICONS[toast.variant]} className="mt-0.5 text-[18px]" />
        <span className="max-w-xs">{toast.text}</span>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setToast(null)}
          className="ml-1 opacity-60 transition hover:opacity-100"
        >
          <Icon name="close" className="text-[18px]" />
        </button>
      </div>
    </div>
  );
}
