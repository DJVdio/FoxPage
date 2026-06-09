import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href, prefetch, ...rest }: { children: React.ReactNode; href: string; prefetch?: boolean }) => (
    <a href={href} data-prefetch={String(prefetch)} {...rest}>
      {children}
    </a>
  ),
}));

import AppBrowser from "./app-browser";

beforeEach(() => window.localStorage.clear());
afterEach(cleanup);

describe("AppBrowser", () => {
  it("shows the library by default", () => {
    render(<AppBrowser />);
    expect(screen.getByText("APP.LIBRARY")).toBeInTheDocument();
    expect(screen.getByText("小游戏")).toBeInTheDocument();
  });

  it("filters by search query (including nested apps)", () => {
    render(<AppBrowser />);
    const input = screen.getByPlaceholderText(/SEARCH/);
    fireEvent.change(input, { target: { value: "snake" } });
    expect(screen.getByText("贪吃蛇")).toBeInTheDocument();
    expect(screen.queryByText("计时器")).toBeNull();
  });

  it("shows NO MATCH for an unknown query", () => {
    render(<AppBrowser />);
    fireEvent.change(screen.getByPlaceholderText(/SEARCH/), { target: { value: "zzzzz" } });
    expect(screen.getByText("NO MATCH FOUND")).toBeInTheDocument();
  });

  it("pins a favorite and persists it", () => {
    render(<AppBrowser />);
    const pins = screen.getAllByLabelText("pin");
    fireEvent.click(pins[0]);
    const favs = JSON.parse(window.localStorage.getItem("foxpage:favorites") ?? "[]");
    expect(favs.length).toBe(1);
    // a FAVORITES section now exists
    expect(screen.getByText("FAVORITES")).toBeInTheDocument();
  });
});
