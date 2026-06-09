import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href, prefetch, ...rest }: { children: React.ReactNode; href: string; prefetch?: boolean }) => (
    <a href={href} data-prefetch={String(prefetch)} {...rest}>
      {children}
    </a>
  ),
}));

import AppCard from "./app-card";

afterEach(cleanup);

describe("AppCard", () => {
  it("renders an internal app as a prefetching link with READY badge", () => {
    render(<AppCard app={{ id: "x", name: "Test App", description: "desc", icon: "🎯", path: "/apps/x" }} index={0} />);
    expect(screen.getByText("Test App")).toBeInTheDocument();
    expect(screen.getByText("READY")).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/apps/x");
    expect(link).toHaveAttribute("data-prefetch", "true");
  });

  it("renders an external app as a new-tab link with EXTERNAL badge", () => {
    render(<AppCard app={{ id: "e", name: "Ext", description: "d", icon: "🌐", externalUrl: "https://example.com" }} index={1} />);
    expect(screen.getByText("EXTERNAL")).toBeInTheDocument();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows the typed status badge when set", () => {
    render(<AppCard app={{ id: "n", name: "New", description: "d", icon: "✨", path: "/apps/n", status: "new" }} index={2} />);
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });
});
