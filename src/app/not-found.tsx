import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center pt-24 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-violet-600">
        <Search className="h-5 w-5" />
      </span>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink-900">
        Nothing here yet
      </h1>
      <p className="mt-1 text-[13px] text-ink-500">
        This tender, vendor or clause doesn't exist — or you don't have access.
      </p>
      <Link href="/" className="btn-primary mt-5">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
    </div>
  );
}
