import { describe, expect, it } from "vitest";
import { analyzeParty } from "../src/party-analyzer.js";
import { suggestCandidates } from "../src/candidate-filter.js";
import type { PartyDiagnosis, Pokemon } from "../src/types.js";

const attackerStats = { hp: 70, attack: 140, defense: 70, spAttack: 60, spDefense: 70, speed: 100 };
const wallStats = { hp: 100, attack: 60, defense: 130, spAttack: 60, spDefense: 80, speed: 50 };

const p = (id: string, types: Pokemon["types"], stats: Pokemon["stats"] = attackerStats): Pokemon =>
  ({ id, name: id, types, stats, roles: [] });

const member = p("member", ["normal"]);
const party = [{ pokemon: member }];

/** A real diagnosis with every signal cleared, so each test switches on only what it checks. */
const diagnosisWith = (signals: Partial<{
  critical: PartyDiagnosis["criticalWeaknesses"];
  warning: PartyDiagnosis["warningWeaknesses"];
  missingRoles: PartyDiagnosis["roleBalance"]["missingRoles"];
  offenseGaps: PartyDiagnosis["offenseGaps"];
}>): PartyDiagnosis => {
  const base = analyzeParty(party);
  return {
    ...base,
    criticalWeaknesses: signals.critical ?? [],
    warningWeaknesses: signals.warning ?? [],
    offenseGaps: signals.offenseGaps ?? [],
    roleBalance: { ...base.roleBalance, missingRoles: signals.missingRoles ?? [] },
  };
};

describe("suggestCandidates", () => {
  it("adds 20 for covering a critical weakness and drops candidates that score 0", () => {
    const ranked = suggestCandidates(party, diagnosisWith({ critical: ["water"] }), [
      member, p("grass", ["grass"]), p("fire", ["fire"]),
    ]);

    expect(ranked).toHaveLength(1);
    expect(ranked[0]).toMatchObject({ score: 20, coveringTypes: ["water"] });
    expect(ranked[0].pokemon.id).toBe("grass");
  });

  it("adds 10 for covering a warning weakness, including by immunity", () => {
    const [top] = suggestCandidates(party, diagnosisWith({ warning: ["ground"] }), [p("flying", ["flying"])]);

    expect(top).toMatchObject({ score: 10, coveringTypes: ["ground"] });
  });

  it("adds 10 when the candidate's dominant role is missing", () => {
    const [top] = suggestCandidates(party, diagnosisWith({ missingRoles: ["physical-wall"] }), [
      p("wall", ["normal"], wallStats), p("attacker", ["normal"]),
    ]);

    expect(top).toMatchObject({ score: 10, fillsRoles: ["physical-wall"] });
    expect(top.pokemon.id).toBe("wall");
  });

  it("adds 5 for each offensive gap its own types hit super-effectively", () => {
    const [top] = suggestCandidates(party, diagnosisWith({ offenseGaps: ["dragon", "steel"] }), [p("ice", ["ice"])]);

    expect(top).toMatchObject({ score: 5, advantageTypes: ["dragon"] });
  });

  it("sums all signals and sorts by score descending", () => {
    const diagnosis = diagnosisWith({
      critical: ["water"], warning: ["ground"], missingRoles: ["physical-wall"], offenseGaps: ["dragon"],
    });

    const ranked = suggestCandidates(party, diagnosis, [
      p("water", ["water"]),
      p("grass-ice-wall", ["grass", "ice"], wallStats),
      p("dragon", ["dragon"]),
    ]);

    expect(ranked.map(c => [c.pokemon.id, c.score])).toEqual([
      ["grass-ice-wall", 20 + 10 + 10 + 5],
      ["dragon", 20 + 5],
      ["water", 20],
    ]);
  });
});
