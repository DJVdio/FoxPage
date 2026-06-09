import Link from "next/link";
import PipHeader from "./pip-header";

/**
 * Shared chrome for a sub-app screen: header + RETURN nav + titled section + footer.
 * Server Component — render interactive parts as client children inside it.
 */
export default function AppScreen({
  title,
  children,
  footer = "VAULT-TEC™",
  backHref = "/",
}: {
  title: string;
  children: React.ReactNode;
  footer?: string;
  backHref?: string;
}) {
  return (
    <>
      <PipHeader />
      <div className="flex flex-1 flex-col px-4 py-6">
        <div className="mx-auto w-full max-w-3xl flex-1">
          <nav className="mb-6">
            <Link
              href={backHref}
              prefetch={true}
              className="inline-flex items-center gap-1 text-xs tracking-[0.1em] text-[#00aa2a] transition-colors hover:text-[#00ff41]"
            >
              <span aria-hidden="true">&lt;</span>
              <span>RETURN</span>
            </Link>
          </nav>

          <div className="mb-6 flex items-center gap-2 text-xs tracking-[0.2em] text-[#00aa2a]">
            <span className="h-px flex-1 bg-gradient-to-r from-[#00ff41]/20 to-transparent" />
            <span>{title}</span>
            <span className="h-px flex-1 bg-gradient-to-l from-[#00ff41]/20 to-transparent" />
          </div>

          {children}
        </div>

        <footer className="mt-6 border-t border-[#003a0f] pt-3 text-center">
          <p className="text-[10px] tracking-[0.15em] text-[#00aa2a]/40">{footer}</p>
        </footer>
      </div>
    </>
  );
}
