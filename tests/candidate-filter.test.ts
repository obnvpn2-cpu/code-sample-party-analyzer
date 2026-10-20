import { describe, expect, it } from "vitest";
import { analyzeParty } from "../src/party-analyzer.js";
import { suggestCandidates } from "../src/candidate-filter.js";
import type { Pokemon } from "../src/types.js";

const baseStats = { hp:90, attack:120, defense:90, spAttack:80, spDefense:90, speed:100 };

const p = (
  id:string, name:string, types:Pokemon["types"], roles:Pokemon["roles"],
  stats:Pokemon["stats"] = baseStats,
):Pokemon => ({id,name,types,roles,stats});

describe("suggestCandidates", () => {
  it("ranks a candidate higher when it covers a critical weakness", () => {
    const partyPokemon = [
      p("a","A",["fire"],["physical-attacker"]),
      p("b","B",["fire"],["physical-attacker"]),
      p("c","C",["rock"],["physical-attacker"]),
    ];
    const party = partyPokemon.map(pokemon => ({pokemon}));
    const diagnosis = analyzeParty(party);

    const waterResistant = p(
      "candidate-1","WaterResistant",["grass"],["special-attacker"],
      {...baseStats, attack:70, spAttack:125},
    );
    const neutral = p(
      "candidate-2","Neutral",["normal"],["support"],
      {...baseStats, attack:70, spAttack:70},
    );

    const ranked = suggestCandidates(
      party, diagnosis, [...partyPokemon, waterResistant, neutral],
    );

    expect(ranked[0].pokemon.id).toBe("candidate-1");
    expect(ranked[0].coveringTypes).toContain("water");
  });
});
