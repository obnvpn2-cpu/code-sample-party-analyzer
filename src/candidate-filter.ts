import type {
  PartyDiagnosis, PartyMember, Pokemon, PokemonRole, PokemonType, SuggestionCandidate,
} from "./types.js";
import { getTypeEffectivenessMulti } from "./type-effectiveness.js";
import { dominantRole } from "./role-classifier.js";

/**
 * Public sample of the weighted candidate-ranking logic.
 *
 * Signals kept in this sample:
 * - +20 per critical defensive weakness covered
 * - +10 per warning defensive weakness covered
 * - +10 if a missing role is filled
 * -  +5 per offensive coverage gap improved
 *
 * Production-only data sources and integrations are intentionally omitted.
 */
export function suggestCandidates(
  party:PartyMember[],
  diagnosis:PartyDiagnosis,
  allPokemon:Pokemon[],
):SuggestionCandidate[] {
  const currentIds = new Set(party.map(({pokemon}) => pokemon.id));
  const criticalWeaknesses = new Set(diagnosis.criticalWeaknesses);
  const warningWeaknesses = new Set(diagnosis.warningWeaknesses);
  const missingRoles = new Set(diagnosis.roleBalance.missingRoles);
  const offenseGaps = new Set(diagnosis.offenseGaps);

  const candidates:SuggestionCandidate[] = [];

  for (const pokemon of allPokemon) {
    if (currentIds.has(pokemon.id)) continue;

    let score = 0;
    const reasons:string[] = [];
    const coveringTypes:PokemonType[] = [];
    const fillsRoles:PokemonRole[] = [];
    const advantageTypes:PokemonType[] = [];

    for (const weakType of criticalWeaknesses) {
      if (getTypeEffectivenessMulti(weakType, pokemon.types) <= .5) {
        score += 20;
        coveringTypes.push(weakType);
        reasons.push(`covers critical ${weakType} weakness`);
      }
    }

    for (const weakType of warningWeaknesses) {
      if (getTypeEffectivenessMulti(weakType, pokemon.types) <= .5) {
        score += 10;
        coveringTypes.push(weakType);
        reasons.push(`covers warning ${weakType} weakness`);
      }
    }

    if (missingRoles.size > 0) {
      const role = dominantRole(pokemon.stats);
      if (missingRoles.has(role)) {
        score += 10;
        fillsRoles.push(role);
        reasons.push(`fills missing role: ${role}`);
      }
    }

    for (const gapType of offenseGaps) {
      const improvesGap = pokemon.types.some(
        attackType => getTypeEffectivenessMulti(attackType, [gapType]) > 1,
      );
      if (improvesGap) {
        score += 5;
        advantageTypes.push(gapType);
        reasons.push(`adds offensive coverage against ${gapType}`);
      }
    }

    if (score > 0) {
      candidates.push({
        pokemon, score, reasons,
        coveringTypes:[...new Set(coveringTypes)],
        fillsRoles, advantageTypes,
      });
    }
  }

  return candidates.sort((a,b) =>
    b.score !== a.score ? b.score - a.score : a.pokemon.name.localeCompare(b.pokemon.name),
  );
}
