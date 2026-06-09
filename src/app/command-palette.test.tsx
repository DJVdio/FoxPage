import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

import CommandPalette from "./command-palette";

beforeEach(() => push.mockReset());
afterEach(cleanup);

describe("CommandPalette", () => {
  it("is hidden until Cmd/Ctrl+K", () => {
    render(<CommandPalette />);
    expect(screen.queryByPlaceholderText(/V.A.T.S/)).toBeNull();
  });

  it("opens on Cmd+K and filters results", () => {
    render(<CommandPalette />);
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    const input = screen.getByPlaceholderText(/V.A.T.S/);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "snake" } });
    expect(screen.getByText("贪吃蛇")).toBeInTheDocument();
    expect(screen.queryByText("计时器")).toBeNull();
  });

  it("closes on Escape", () => {
    render(<CommandPalette />);
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    const input = screen.getByPlaceholderText(/V.A.T.S/);
    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByPlaceholderText(/V.A.T.S/)).toBeNull();
  });
});
