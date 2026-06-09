import { apps } from "@/data/apps";
import AppBrowser from "./app-browser";
import PipHeader from "./pip-header";

export default function Home() {
  return (
    <>
      <PipHeader appCount={apps.length} />
      <div className="flex flex-1 flex-col px-4 py-6">
        <div className="mx-auto w-full max-w-3xl flex-1">
          <AppBrowser />
        </div>

        <footer className="mt-6 border-t border-[#003a0f] pt-3 text-center">
          <p className="text-[10px] tracking-[0.15em] text-[#00aa2a]/40">
            VAULT-TEC™ · SELECT AN APPLICATION TO LAUNCH
          </p>
        </footer>
      </div>
    </>
  );
}
