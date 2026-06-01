"use client";

import { useState, useCallback } from "react";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function Spinner() {
  return (
    <svg
      className="animate-spin-smooth h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function CheckmarkIcon() {
  return (
    <svg
      className="h-5 w-5 text-emerald-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M5 13l4 4L19 7"
        strokeDasharray="24"
        className="animate-checkmark"
      />
    </svg>
  );
}

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [touched, setTouched] = useState(false);

  const emailValid = isValidEmail(email);
  const showError = touched && email.length > 0 && !emailValid;
  const showValid = touched && emailValid;

  const handleBlur = useCallback(() => {
    if (email.length > 0) setTouched(true);
  }, [email]);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !emailValid) {
      setTouched(true);
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="animate-success-fade flex items-center gap-2.5 py-2">
        <CheckmarkIcon />
        <div>
          <p className="text-sm font-semibold text-stone-900">
            You&apos;re in!
          </p>
          <p className="text-xs text-stone-400 mt-0.5">
            See you Monday with your first digest.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={subscribe} className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          onBlur={handleBlur}
          placeholder="your@email.com"
          className={`w-full rounded-full border bg-white px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
            showError
              ? "border-red-300 focus:ring-red-200"
              : showValid
              ? "border-emerald-300 focus:ring-emerald-200"
              : "border-stone-200 focus:ring-stone-900"
          }`}
        />
        {showValid && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
      </div>
      <button
        type="submit"
        disabled={state === "loading"}
        className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-700 transition-colors disabled:opacity-60 flex items-center gap-2 shrink-0"
      >
        {state === "loading" ? (
          <>
            <Spinner />
            <span className="sr-only">Subscribing...</span>
          </>
        ) : (
          "Subscribe"
        )}
      </button>
      {(showError || state === "error") && (
        <p className="absolute -bottom-6 left-0 text-xs text-red-500">
          {state === "error" ? "Something went wrong. Try again." : "Enter a valid email."}
        </p>
      )}
    </form>
  );
}
