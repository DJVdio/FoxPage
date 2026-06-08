import Link from "next/link";
import { apps } from "@/data/apps";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center px-4 py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">App Market</h1>
        <p className="mt-2 text-lg text-stone-500">Browse and launch web apps</p>
      </header>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {apps.map((app) => (
          <Link
            key={app.id}
            href={app.path}
            className="group flex flex-col gap-2 rounded-xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-sm"
          >
            <span className="text-3xl">{app.icon}</span>
            <h2 className="text-lg font-semibold">{app.name}</h2>
            <p className="text-sm text-stone-500">{app.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
