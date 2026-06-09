import AppScreen from "@/app/app-screen";
import NotesPad from "./notes-pad";

export default function NotesPage() {
  return (
    <AppScreen title="QUICKNOTE.LOG" footer="VAULT-TEC™ · 本地暂存 · 仅保存在此浏览器">
      <NotesPad />
    </AppScreen>
  );
}
