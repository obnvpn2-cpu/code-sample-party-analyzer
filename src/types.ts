export const POKEMON_TYPES = [
  "normal","fire","water","electric","grass","ice","fighting","poison",
  "ground","flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy",
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];
export type PokemonRole =
  | "physical-attacker" | "special-attacker" | "physical-wall"
  | "special-wall" | "sweeper" | "support";

export interface BaseStats {
  hp:number; attack:number; defense:number; spAttack:number; spDefense:number; speed:number;
}
export interface Pokemon {
  id:string; name:string; types:PokemonType[]; stats:BaseStats; roles:PokemonRole[];
}
export interface PartyMember { pokemon: Pokemon; }
export type Severity = "good" | "warning" | "critical";

export interface TypeDefenseResult {
  attackType:PokemonType; weakCount:number; resistCount:number; immuneCount:number; severity:Severity;
}
export interface RoleBalance {
  roles:Record<PokemonRole, number>; missingRoles:PokemonRole[];
}
export interface PartyDiagnosis {
  defenseResults:TypeDefenseResult[];
  criticalWeaknesses:PokemonType[];
  warningWeaknesses:PokemonType[];
  offenseGaps:PokemonType[];
  roleBalance:RoleBalance;
  physicalSpecial:{ physicalAttackers:number; specialAttackers:number; severity:Severity; };
  score:number;
}
export interface SuggestionCandidate {
  pokemon:Pokemon; score:number; reasons:string[];
  coveringTypes:PokemonType[]; fillsRoles:PokemonRole[]; advantageTypes:PokemonType[];
}
