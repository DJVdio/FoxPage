import Link from "next/link";

export default function HelloWorldPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <nav className="mb-8 self-start">
        <Link href="/" className="text-sm text-stone-500 hover:text-stone-800">
          &larr; Back to Market
        </Link>
      </nav>

      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">Hello, World!</h1>
        <p className="mt-4 text-lg text-stone-500">
          Your first app is running on Next.js.
        </p>
      </div>
    </div>
  );
}
