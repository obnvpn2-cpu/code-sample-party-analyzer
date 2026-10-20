import { describe, expect, it } from "vitest";
import { analyzeParty } from "../src/party-analyzer.js";
import type { Pokemon } from "../src/types.js";

const makePokemon = (
  id: string, types: Pokemon["types"], roles: Pokemon["roles"] = ["special-attacker"],
): Pokemon => ({
  id, name: id, types, roles,
  stats: {
    hp: 90,
    attack: roles.includes("physical-attacker") ? 130 : 70,
    defense: 90,
    spAttack: roles.includes("special-attacker") ? 130 : 70,
    spDefense: 90,
    speed: 100,
  },
});

const partyOf = (...pokemon: Pokemon[]) => pokemon.map(p => ({ pokemon: p }));

const defenseAgainst = (party: ReturnType<typeof partyOf>, type: Pokemon["types"][number]) =>
  analyzeParty(party).defenseResults.find(r => r.attackType === type)!;

describe("analyzeParty", () => {
  it("marks a weakness shared by 3+ members with no safe switch-in as critical", () => {
    const result = analyzeParty(partyOf(
      makePokemon("a", ["fire"]),
      makePokemon("b", ["fire"]),
      makePokemon("c", ["rock"], ["physical-attacker"]),
    ));

    expect(result.criticalWeaknesses).toContain("water");
    expect(result.score).toBeLessThan(100);
  });

  it("marks a weakness shared by 2 members as warning", () => {
    const party = partyOf(makePokemon("a", ["fire"]), makePokemon("b", ["rock"]));

    expect(defenseAgainst(party, "water").severity).toBe("warning");
    expect(analyzeParty(party).warningWeaknesses).toContain("water");
  });

  it("does not mark a weakness critical when an immune member can switch in", () => {
    const party = partyOf(
      makePokemon("a", ["fire"]),
      makePokemon("b", ["electric"]),
      makePokemon("c", ["rock"]),
      makePokemon("d", ["flying"]),
    );

    const ground = defenseAgainst(party, "ground");
    expect(ground).toMatchObject({ weakCount: 3, resistCount: 0, immuneCount: 1 });
    expect(ground.severity).toBe("warning");
  });

  it("reports physical/special imbalance", () => {
    const party = partyOf(
      makePokemon("a", ["normal"], ["physical-attacker"]),
      makePokemon("b", ["normal"], ["physical-attacker"]),
      makePokemon("c", ["normal"], ["physical-attacker"]),
      makePokemon("d", ["normal"], ["physical-attacker"]),
    );

    expect(analyzeParty(party).physicalSpecial.severity).toBe("critical");
  });

  it("rejects an empty party instead of scoring it 100", () => {
    expect(() => analyzeParty([])).toThrow(RangeError);
  });
});
