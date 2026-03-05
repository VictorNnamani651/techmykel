"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const cleanedPhone = phone.trim();
    if (!cleanedPhone || !password) {
      setError("Please fill in all fields.");
      return;
    }

    startTransition(async () => {
      const res = await signIn("credentials", {
        phoneNumber: cleanedPhone,
        password: password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials. Please try again.");
        return;
      }

      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;

      if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    });
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--navy)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top Blue Header ── */}
      <div
        style={{ padding: "4rem 2rem 3rem", color: "#fff", flex: "0 0 auto" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <img
            src="/logo-2.jpg"
            alt="TechMykel Logo"
            style={{ height: "40px", borderRadius: "8px" }}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: "1.2rem",
              letterSpacing: "1px",
            }}
          >
            TechMykel
          </span>
        </div>

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Welcome Back!
          <br />
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 400,
              opacity: 0.8,
              display: "block",
              marginTop: "0.5rem",
            }}
          >
            Sign in to access your referral dashboard.
          </span>
        </h1>
      </div>

      {/* ── White Form Card ── */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          borderTopLeftRadius: "2rem",
          borderTopRightRadius: "2rem",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            flex: 1,
          }}
        >
          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "0.75rem",
                borderRadius: "8px",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Email/Phone Field */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#333",
                marginBottom: "0.5rem",
                marginLeft: "0.5rem",
              }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              className="auth-input"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isPending}
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#333",
                marginBottom: "0.5rem",
                marginLeft: "0.5rem",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                style={{ letterSpacing: password ? "2px" : "normal" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#9ca3af",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.75rem",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                color: "#4b5563",
              }}
            >
              <input type="checkbox" style={{ accentColor: "var(--navy)" }} />
              Remember me
            </label>
            <Link
              href="#"
              style={{
                color: "#4b5563",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="auth-btn"
            disabled={isPending}
            style={{ marginTop: "1rem" }}
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>

          {/* Signup Link */}
          <p
            style={{
              textAlign: "center",
              marginTop: "auto",
              paddingTop: "2rem",
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              style={{
                color: "var(--navy)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
