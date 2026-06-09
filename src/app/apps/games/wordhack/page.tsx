import AppScreen from "@/app/app-screen";
import WordHack from "./wordhack";

export default function WordHackPage() {
  return (
    <AppScreen title="WORD.HACK" footer="ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL" backHref="/apps/games">
      <WordHack />
    </AppScreen>
  );
}
