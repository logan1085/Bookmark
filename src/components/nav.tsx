"use client";

import Link from "next/link";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

export function Nav() {
  const { isSignedIn } = useUser();

  return (
    <nav className="border-b border-stone-200 bg-stone-50 sticky top-0 z-10">
      <div className="mx-auto max-w-2xl flex items-center justify-between px-4 py-4">
        <Link href="/" className="font-bold text-stone-900 tracking-tight text-lg">
          bookmark
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/archive"
            className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            Archive
          </Link>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <button className="text-sm font-medium bg-stone-900 text-white px-3 py-1.5 rounded-full hover:bg-stone-700 transition-colors">
                Sign in
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
