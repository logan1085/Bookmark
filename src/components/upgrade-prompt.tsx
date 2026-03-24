export function UpgradePrompt({ feature }: { feature?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
      <p className="text-sm font-medium text-gray-700">
        {feature ? `Want more ${feature}?` : "Want more?"}
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Email{" "}
        <a
          href="mailto:LoganHorowitz2@gmail.com"
          className="text-blue-600 underline underline-offset-2"
        >
          LoganHorowitz2@gmail.com
        </a>{" "}
        and we&apos;ll get you set up.
      </p>
    </div>
  );
}
