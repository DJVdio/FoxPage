import Link from "next/link";
import PipHeader from "@/app/pip-header";

const miniGames = [
  {
    id: "snake",
    name: "贪吃蛇",
    description: "经典 Snake 游戏 · 方向键控制",
    icon: "🐍",
    path: "/apps/games/snake",
  },
  {
    id: "flappybird",
    name: "Flappy Bird",
    description: "按空格/点击飞行 · 经典 flappy bird",
    icon: "🐦",
    path: "/apps/games/flappybird",
  },
]

export default function GamesPage() {
  return (
    <>
      <PipHeader />
      <div className="flex flex-1 flex-col px-4 py-6">
        <div className="mx-auto w-full max-w-3xl flex-1">
          <nav className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs tracking-[0.1em] text-[#00aa2a] transition-colors hover:text-[#00ff41]"
            >
              <span aria-hidden="true">&lt;</span>
              <span>RETURN</span>
            </Link>
          </nav>

          <div className="mb-6 flex items-center gap-2 text-xs tracking-[0.2em] text-[#00aa2a]">
            <span className="h-px flex-1 bg-gradient-to-r from-[#00ff41]/20 to-transparent" />
            <span>GAMES.LIBRARY</span>
            <span className="h-px flex-1 bg-gradient-to-l from-[#00ff41]/20 to-transparent" />
          </div>

          <div className="space-y-3">
            {miniGames.map((game, i) => (
              <Link
                key={game.id}
                href={game.path}
                className="pip-card pip-border group flex items-center gap-4 rounded px-4 py-3 transition-all duration-200"
              >
                <span className="w-6 text-center text-xs font-bold text-[#00aa2a]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="pip-border flex h-10 w-10 items-center justify-center rounded text-lg">
                  {game.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-sm font-semibold tracking-[0.05em] text-[#00ff41]">
                      {game.name}
                    </h2>
                    <span className="shrink-0 rounded border border-[#00aa2a]/30 px-1.5 py-0.5 text-[10px] tracking-[0.1em] text-[#00aa2a]">
                      READY
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-[#00aa2a]/70">
                    {game.description}
                  </p>
                </div>
                <span className="text-[#00aa2a]/40 group-hover:text-[#00ff41]">&gt;</span>
              </Link>
            ))}
          </div>
        </div>

        <footer className="mt-6 border-t border-[#003a0f] pt-3 text-center">
          <p className="text-[10px] tracking-[0.15em] text-[#00aa2a]/40">
            VAULT-TEC™ · SELECT A GAME TO PLAY
          </p>
        </footer>
      </div>
    </>
  );
}
