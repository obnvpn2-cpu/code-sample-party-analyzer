import { describe, expect, it } from "vitest";
import { getTypeEffectiveness, getTypeEffectivenessMulti } from "../src/type-effectiveness.js";

describe("type effectiveness", () => {
  it("returns the chart value for a single defending type", () => {
    expect(getTypeEffectiveness("fire", "grass")).toBe(2);
    expect(getTypeEffectiveness("fire", "water")).toBe(.5);
    expect(getTypeEffectiveness("fire", "normal")).toBe(1);
  });

  it("multiplies the multipliers of a dual type", () => {
    expect(getTypeEffectivenessMulti("ice", ["dragon", "flying"])).toBe(4);
    expect(getTypeEffectivenessMulti("fire", ["water", "dragon"])).toBe(.25);
    expect(getTypeEffectivenessMulti("ground", ["fire", "grass"])).toBe(1);
  });

  it("returns 0 when either defending type is immune", () => {
    expect(getTypeEffectivenessMulti("ground", ["flying"])).toBe(0);
    expect(getTypeEffectivenessMulti("ground", ["fire", "flying"])).toBe(0);
  });
});
