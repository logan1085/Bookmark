"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

export function Nav() {
  const { isSignedIn } = useUser();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  function handleClose() {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 200);
  }

  function toggleMenu() {
    if (open) {
      handleClose();
    } else {
      setOpen(true);
    }
  }

  // Close on escape key
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape" && open) handleClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <>
      <nav className="border-b border-stone-200 bg-stone-50/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto max-w-2xl flex items-center justify-between px-4 py-4">
          <Link href="/" className="font-extrabold text-stone-900 tracking-tight text-lg">
            bookmark
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/archive"
              className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
            >
              Archive
            </Link>
            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <button className="text-sm font-semibold bg-stone-900 text-white px-4 py-1.5 rounded-full hover:bg-stone-700 transition-colors">
                  Sign in
                </button>
              </SignInButton>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-stone-600 hover:text-stone-900 transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open && !closing ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div
            ref={menuRef}
            className={`md:hidden border-t border-stone-100 bg-stone-50/95 backdrop-blur-sm px-4 py-4 space-y-3 overflow-hidden ${
              closing ? "animate-menu-close" : "animate-menu-open"
            }`}
          >
            <Link
              href="/archive"
              onClick={handleClose}
              className="block text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Archive
            </Link>
            <div>
              {isSignedIn ? (
                <UserButton />
              ) : (
                <SignInButton mode="modal">
                  <button className="text-sm font-semibold bg-stone-900 text-white px-4 py-1.5 rounded-full hover:bg-stone-700 transition-colors">
                    Sign in
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop overlay for mobile menu */}
      {open && (
        <div
          className={`fixed inset-0 bg-stone-900/10 backdrop-blur-[2px] z-20 md:hidden transition-opacity duration-200 ${
            closing ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}
