export default function PipHeader({ appCount = 0 }: { appCount?: number }) {
  return (
    <header className="border-b border-[#003a0f] px-4 py-3">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl leading-none tracking-[0.3em] text-[#00ff41]">[::]</span>
          <h1 className="text-lg font-bold tracking-[0.15em] text-[#00ff41]">
            FOXPAGE<span className="text-[#00aa2a]">.OS</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 text-xs tracking-[0.1em] text-[#00aa2a]">
          <span className="pip-blink">&#9632;</span>
          <span>ONLINE</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">{appCount} APP{appCount !== 1 ? "S" : ""}</span>
        </div>
      </div>
    </header>
  );
}
