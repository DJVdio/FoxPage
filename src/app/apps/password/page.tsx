import AppScreen from "@/app/app-screen";
import PasswordGen from "./password-gen";

export default function PasswordPage() {
  return (
    <AppScreen title="PASSCODE.GENERATOR" footer="VAULT-TEC™ · SECURITY SUBROUTINE · 本地生成 · 不离开浏览器">
      <PasswordGen />
    </AppScreen>
  );
}
