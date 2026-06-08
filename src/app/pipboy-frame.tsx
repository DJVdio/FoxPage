import type { ReactNode } from "react";

export default function PipBoyFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#1a1a14] p-2 sm:p-6 md:p-10">
      <div className="pip-device relative mx-auto w-full max-w-2xl">
        <div className="pip-device-body relative rounded-[28px] border-2 border-[#4a4a3a] bg-[#2a2a22] p-3 shadow-2xl sm:rounded-[32px] sm:p-4">
          <div className="pip-device-inner relative rounded-2xl border border-[#3a3a2a] bg-[#1a1a14] p-2 sm:rounded-2xl sm:p-3">
            <div className="pip-strap" />

            <div className="pip-brand-top">
              <span className="text-[8px] tracking-[0.3em] text-[#5a5a48] sm:text-[10px]">VAULT-TEC</span>
              <span className="text-[6px] tracking-[0.2em] text-[#4a4a38] sm:text-[8px]">PIP-BOY 3000</span>
            </div>

            <div className="pip-screen-area relative overflow-hidden rounded-xl border border-[#0a0a08] bg-[#0a0f0a] shadow-inner">
              <div className="pip-screen-curve pointer-events-none absolute inset-0 z-30 rounded-xl" />
              <div className="pip-screen-glow pointer-events-none absolute inset-0 z-20 opacity-30" />
              <div className="relative z-10 min-h-[400px]">{children}</div>
            </div>

            <div className="pip-controls">
              <div className="flex items-center gap-3">
                <div className="pip-speaker-grille flex gap-[3px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="block h-5 w-[3px] rounded-sm bg-[#3a3a2a] sm:h-6" />
                  ))}
                </div>
                <span className="text-[6px] tracking-[0.2em] text-[#4a4a38] sm:text-[8px]">
                  FOXPAGE.OS
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="pip-led h-2 w-2 rounded-full bg-[#00ff41] shadow-[0_0_6px_#00ff41]" />
                <div className="pip-knob relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-[#5a5a48] bg-[#3a3a2a] shadow-inner sm:h-8 sm:w-8">
                  <div className="h-3 w-0.5 rounded bg-[#6a6a58] sm:h-4" />
                </div>
                <div className="pip-knob relative flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 border-[#5a5a48] bg-[#3a3a2a] shadow-inner sm:h-6 sm:w-6">
                  <div className="h-2 w-0.5 rounded bg-[#6a6a58]" />
                </div>
              </div>
            </div>

            <div className="mt-1 text-center text-[5px] tracking-[0.25em] text-[#3a3a28] sm:text-[7px]">
              FOXPAGE · BUILT WITH VAULT-TEC™ TECHNOLOGY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
