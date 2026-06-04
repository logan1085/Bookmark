"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function ShareButtons({ pageUrl }: { pageUrl: string }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    const fullUrl = window.location.origin + pageUrl;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareOnX() {
    const fullUrl = window.location.origin + pageUrl;
    const text = encodeURIComponent(
      `Just read this week\u2019s Bookmark digest \u2014 three articles worth your time. ${fullUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 bg-white border border-stone-200 rounded-full px-3 py-1.5 transition-colors hover:border-stone-300 hover:shadow-sm"
      >
        {copied ? (
          <>
            <Check size={12} /> Copied!
          </>
        ) : (
          <>
            <Link2 size={12} /> Copy
          </>
        )}
      </button>
      <button
        onClick={shareOnX}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-stone-900 rounded-full px-3 py-1.5 transition-colors hover:bg-stone-700"
      >
        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share
      </button>
    </div>
  );
}
