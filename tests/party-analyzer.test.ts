import { describe, expect, it } from "vitest";
import { analyzeParty } from "../src/party-analyzer.js";
import type { Pokemon } from "../src/types.js";

const makePokemon = (
  id:string, name:string, types:Pokemon["types"], roles:Pokemon["roles"],
):Pokemon => ({
  id, name, types, roles,
  stats:{
    hp:90,
    attack:roles.includes("physical-attacker") ? 130 : 70,
    defense:90,
    spAttack:roles.includes("special-attacker") ? 130 : 70,
    spDefense:90,
    speed:100,
  },
});

describe("analyzeParty", () => {
  it("detects stacked weaknesses", () => {
    const party = [
      makePokemon("a","A",["fire"],["special-attacker"]),
      makePokemon("b","B",["fire"],["special-attacker"]),
      makePokemon("c","C",["rock"],["physical-attacker"]),
    ].map(pokemon => ({pokemon}));

    const result = analyzeParty(party);
    expect(result.criticalWeaknesses).toContain("water");
    expect(result.score).toBeLessThan(100);
  });

  it("reports physical/special imbalance", () => {
    const party = [
      makePokemon("a","A",["normal"],["physical-attacker"]),
      makePokemon("b","B",["normal"],["physical-attacker"]),
      makePokemon("c","C",["normal"],["physical-attacker"]),
      makePokemon("d","D",["normal"],["physical-attacker"]),
    ].map(pokemon => ({pokemon}));

    expect(analyzeParty(party).physicalSpecial.severity).toBe("critical");
  });
});
