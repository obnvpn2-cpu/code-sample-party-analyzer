import { describe, expect, it } from "vitest";
import { classifyRoleScores, dominantRole } from "../src/role-classifier.js";
import type { BaseStats } from "../src/types.js";

const stats = (overrides: Partial<BaseStats>): BaseStats => ({
  hp: 70, attack: 70, defense: 70, spAttack: 70, spDefense: 70, speed: 70, ...overrides,
});

describe("role classifier", () => {
  it("classifies attackers by their stronger attacking stat", () => {
    expect(dominantRole(stats({ attack: 140, spAttack: 60, speed: 100 }))).toBe("physical-attacker");
    expect(dominantRole(stats({ attack: 60, spAttack: 140, speed: 100 }))).toBe("special-attacker");
  });

  it("classifies walls by their stronger defensive stat", () => {
    expect(dominantRole(stats({ hp: 100, defense: 130, spDefense: 80 }))).toBe("physical-wall");
    expect(dominantRole(stats({ hp: 100, defense: 80, spDefense: 130 }))).toBe("special-wall");
  });

  it("prefers sweeper for a fast attacker without a dominant attacking stat", () => {
    const fastMixed = stats({ hp: 60, defense: 60, spDefense: 60, attack: 120, spAttack: 115, speed: 130 });

    expect(classifyRoleScores(fastMixed)).toMatchObject({
      sweeper: 4, "physical-attacker": 3.5, "special-attacker": 2.5,
    });
    expect(dominantRole(fastMixed)).toBe("sweeper");
  });

  it("breaks ties by declaration order", () => {
    const balanced = stats({ hp: 100, attack: 100, defense: 100, spAttack: 100, spDefense: 100, speed: 100 });
    const scores = classifyRoleScores(balanced);

    expect(scores["physical-wall"]).toBe(scores["special-wall"]);
    expect(dominantRole(balanced)).toBe("physical-wall");
  });
});
