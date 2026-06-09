import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Profile from "./profile";

beforeEach(() => window.localStorage.clear());
afterEach(cleanup);

describe("Profile", () => {
  it("shows an empty state with no launches", () => {
    render(<Profile />);
    expect(screen.getByText("NO RECORDS YET")).toBeInTheDocument();
  });

  it("renders the dweller dashboard once launches exist", () => {
    const now = Date.now();
    const launches = [
      { id: "converter", ts: now - 1000 },
      { id: "converter", ts: now - 500 },
      { id: "wordhack", ts: now - 200 },
    ];
    window.localStorage.setItem("foxpage:launches", JSON.stringify(launches));

    render(<Profile />);
    expect(screen.getByText("VAULT DWELLER")).toBeInTheDocument();
    expect(screen.getByText("S.P.E.C.I.A.L.")).toBeInTheDocument();
    expect(screen.getByText("MOST USED")).toBeInTheDocument();
  });
});
