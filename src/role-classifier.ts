import type { BaseStats, PokemonRole } from "./types.js";

const clamp10 = (value:number) => Math.max(0, Math.min(10, value));

function tierScore(value:number, thresholds:readonly [number, number, number]):number {
  if (value >= thresholds[0]) return 3;
  if (value >= thresholds[1]) return 2;
  if (value >= thresholds[2]) return 1;
  return 0;
}

export function classifyRoleScores(stats:BaseStats):Record<PokemonRole, number> {
  const physical =
    tierScore(stats.attack, [140,125,110]) +
    tierScore(stats.speed, [115,100,85]) * .5 +
    (stats.attack > stats.spAttack + 20 ? 2 : stats.attack > stats.spAttack ? 1 : 0);

  const special =
    tierScore(stats.spAttack, [140,125,110]) +
    tierScore(stats.speed, [115,100,85]) * .5 +
    (stats.spAttack > stats.attack + 20 ? 2 : stats.spAttack > stats.attack ? 1 : 0);

  const physicalWall =
    tierScore(stats.hp,[100,85,70]) +
    tierScore(stats.defense,[130,110,90]) +
    (stats.defense > stats.spDefense + 20 ? 1 : 0);

  const specialWall =
    tierScore(stats.hp,[100,85,70]) +
    tierScore(stats.spDefense,[130,110,90]) +
    (stats.spDefense > stats.defense + 20 ? 1 : 0);

  const sweeper =
    tierScore(stats.speed,[125,100,85]) +
    tierScore(Math.max(stats.attack, stats.spAttack),[140,125,110]);

  const support =
    (stats.hp >= 100 ? 1 : 0) +
    (stats.defense >= 90 || stats.spDefense >= 90 ? 1 : 0) +
    (Math.max(stats.attack, stats.spAttack) < 90 ? 1 : 0);

  return {
    "physical-attacker":clamp10(physical),
    "special-attacker":clamp10(special),
    "physical-wall":clamp10(physicalWall),
    "special-wall":clamp10(specialWall),
    sweeper:clamp10(sweeper),
    support:clamp10(support),
  };
}

export function dominantRole(stats:BaseStats):PokemonRole {
  return (Object.entries(classifyRoleScores(stats)) as [PokemonRole, number][])
    .sort((a,b) => b[1] - a[1])[0][0];
}
