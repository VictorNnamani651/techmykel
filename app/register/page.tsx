"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/app/actions";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("password", password);

    startTransition(async () => {
      try {
        await registerUser(formData);
        // On success, redirect to login
        router.push("/login?registered=true");
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
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
          Create Your
          <br />
          Account
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
            Join the smart and secure referral platform.
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

          {/* Name Field */}
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
              Name
            </label>
            <input
              type="text"
              className="auth-input"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>

          {/* Phone Field */}
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
              Phone
            </label>
            <input
              type="tel"
              className="auth-input"
              placeholder="Enter Your Phone Number"
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

          {/* Terms & Conditions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "0.75rem",
              color: "#4b5563",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                style={{ accentColor: "var(--navy)" }}
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              I agree with <strong>Terms & Conditions</strong>
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="auth-btn"
            disabled={isPending}
            style={{ marginTop: "1rem" }}
          >
            {isPending ? "Signing up..." : "Sign up"}
          </button>

          {/* Login Link */}
          <p
            style={{
              textAlign: "center",
              marginTop: "auto",
              paddingTop: "2rem",
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "var(--navy)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
