import {
  POKEMON_TYPES, type PartyDiagnosis, type PartyMember, type PokemonRole,
  type PokemonType, type RoleBalance, type Severity, type TypeDefenseResult,
} from "./types.js";
import { getTypeEffectivenessMulti } from "./type-effectiveness.js";

const ALL_ROLES: PokemonRole[] = [
  "physical-attacker", "special-attacker", "physical-wall",
  "special-wall", "sweeper", "support",
];

function analyzeTypeDefense(party: PartyMember[]): TypeDefenseResult[] {
  return POKEMON_TYPES.map((attackType) => {
    let weakCount = 0, resistCount = 0, immuneCount = 0;

    for (const member of party) {
      const multiplier = getTypeEffectivenessMulti(attackType, member.pokemon.types);
      if (multiplier === 0) immuneCount++;
      else if (multiplier > 1) weakCount++;
      else if (multiplier < 1) resistCount++;
    }

    // An immune member can switch into the attack just as safely as a resisting one.
    const safeSwitchIns = resistCount + immuneCount;

    let severity: Severity = "good";
    if (weakCount >= 3 && safeSwitchIns === 0) severity = "critical";
    else if (weakCount >= 2) severity = "warning";

    return { attackType, weakCount, resistCount, immuneCount, severity };
  });
}

function analyzeRoleBalance(party: PartyMember[]): RoleBalance {
  const roles = Object.fromEntries(ALL_ROLES.map(role => [role, 0])) as Record<PokemonRole, number>;

  for (const member of party) {
    for (const role of member.pokemon.roles) roles[role]++;
  }

  return { roles, missingRoles: ALL_ROLES.filter(role => roles[role] === 0) };
}

function analyzePhysicalSpecial(party: PartyMember[]) {
  let physicalAttackers = 0, specialAttackers = 0;

  for (const { pokemon } of party) {
    if (pokemon.roles.includes("physical-attacker")) physicalAttackers++;
    if (pokemon.roles.includes("special-attacker")) specialAttackers++;
  }

  let severity: Severity = "good";
  if ((physicalAttackers >= 4 && specialAttackers === 0) ||
      (specialAttackers >= 4 && physicalAttackers === 0)) severity = "critical";
  else if ((physicalAttackers > 0 && specialAttackers === 0) ||
           (specialAttackers > 0 && physicalAttackers === 0)) severity = "warning";

  return { physicalAttackers, specialAttackers, severity };
}

function analyzeOffenseGaps(party: PartyMember[]): PokemonType[] {
  return POKEMON_TYPES.filter((targetType) =>
    !party.some(({ pokemon }) =>
      pokemon.types.some((attackType) =>
        getTypeEffectivenessMulti(attackType, [targetType]) > 1,
      ),
    ),
  );
}

function calculateScore(
  defenseResults: TypeDefenseResult[],
  physicalSpecial: ReturnType<typeof analyzePhysicalSpecial>,
): number {
  let score = 100;
  for (const result of defenseResults) {
    if (result.severity === "critical") score -= 8;
    else if (result.severity === "warning") score -= 3;
  }
  if (physicalSpecial.severity === "critical") score -= 10;
  else if (physicalSpecial.severity === "warning") score -= 5;
  return Math.max(0, Math.min(100, score));
}

/**
 * Diagnoses a party's defensive weaknesses, offensive gaps and role balance.
 *
 * @throws {RangeError} if the party is empty — there is nothing to score,
 *   and returning a perfect 100 would be misleading.
 */
export function analyzeParty(party: PartyMember[]): PartyDiagnosis {
  if (party.length === 0) {
    throw new RangeError("analyzeParty: party must contain at least one member");
  }

  const defenseResults = analyzeTypeDefense(party);
  const physicalSpecial = analyzePhysicalSpecial(party);

  return {
    defenseResults,
    criticalWeaknesses: defenseResults.filter(r => r.severity === "critical").map(r => r.attackType),
    warningWeaknesses: defenseResults.filter(r => r.severity === "warning").map(r => r.attackType),
    offenseGaps: analyzeOffenseGaps(party),
    roleBalance: analyzeRoleBalance(party),
    physicalSpecial,
    score: calculateScore(defenseResults, physicalSpecial),
  };
}
