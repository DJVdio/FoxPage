import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePersistent } from "./use-persistent";

beforeEach(() => window.localStorage.clear());

describe("usePersistent", () => {
  it("starts from the fallback", () => {
    const { result } = renderHook(() => usePersistent("greeting", "fb"));
    expect(result.current[0]).toBe("fb");
  });

  it("updates state and persists to storage", () => {
    const { result } = renderHook(() => usePersistent<number>("count", 0));
    act(() => result.current[1](5));
    expect(result.current[0]).toBe(5);
    expect(window.localStorage.getItem("foxpage:count")).toBe("5");
  });

  it("supports functional updates", () => {
    const { result } = renderHook(() => usePersistent<number>("n", 1));
    act(() => result.current[1]((prev) => prev + 1));
    expect(result.current[0]).toBe(2);
  });

  it("reads an existing stored value", () => {
    window.localStorage.setItem("foxpage:pre", JSON.stringify("stored"));
    const { result } = renderHook(() => usePersistent("pre", "fb"));
    expect(result.current[0]).toBe("stored");
  });
});
