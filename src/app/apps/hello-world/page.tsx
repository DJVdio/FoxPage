import Link from "next/link";
import PipHeader from "@/app/pip-header";

export default function HelloWorldPage() {
  return (
    <>
      <PipHeader />
      <div className="flex flex-1 flex-col px-4 py-6">
        <div className="mx-auto w-full max-w-3xl flex-1">
          <nav className="mb-6">
            <Link
              href="/"
              prefetch={true}
              className="inline-flex items-center gap-1 text-xs tracking-[0.1em] text-[#00aa2a] transition-colors hover:text-[#00ff41]"
            >
              <span aria-hidden="true">&lt;</span>
              <span>RETURN</span>
            </Link>
          </nav>

          <div className="pip-border rounded p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="pip-border flex h-8 w-8 items-center justify-center rounded text-sm">👋</span>
              <hr className="pip-divider flex-1" />
            </div>

            <div className="space-y-3">
              <p className="text-xs tracking-[0.15em] text-[#00aa2a]">
                &gt; EXECUTE: hello-world.exe
              </p>

              <h1 className="text-3xl font-bold tracking-[0.05em] text-[#00ff41]">
                Hello, World!
              </h1>

              <p className="text-sm leading-relaxed text-[#00aa2a]/80">
                &gt; Application loaded successfully. Your first app is running on FOXPAGE.OS.
              </p>

              <div className="pip-progress mt-4 w-full max-w-xs">
                <div className="pip-progress-fill" style={{ width: "100%" }} />
              </div>

              <p className="text-[10px] tracking-[0.1em] text-[#00aa2a]/40">
                STATUS: RUNNING · MEM: 0.4% · UPTIME: 00:00:01
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-6 border-t border-[#003a0f] pt-3 text-center">
          <p className="text-[10px] tracking-[0.15em] text-[#00aa2a]/40">
            PIP-BOY 3000 · FOXPAGE.OS v0.1
          </p>
        </footer>
      </div>
    </>
  );
}
