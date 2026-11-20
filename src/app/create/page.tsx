import type { Metadata } from "next";
import Link from "next/link";
import { CreateForm } from "@/components/create/CreateForm";

export const metadata: Metadata = {
  title: "Create",
  description: "Craft and share your wedding invitation link.",
};

export default function CreatePage() {
  return (
    <main className="min-h-[100svh] bg-[linear-gradient(180deg,#f7f1e8_0%,#efe4d4_100%)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-sm text-stone-600 underline-offset-4 hover:underline"
        >
          Home
        </Link>
        <Link
          href="/i"
          className="text-sm text-stone-600 underline-offset-4 hover:underline"
        >
          Sample invite
        </Link>
      </nav>
      <CreateForm />
    </main>
  );
}
