import { POKEMON_TYPES, type PokemonType } from "./types.js";

const RAW_CHART: readonly (readonly number[])[] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,.5,0,1,1,.5,1],
  [1,.5,.5,1,2,2,1,1,1,1,1,2,.5,1,.5,1,2,1],
  [1,2,.5,1,.5,1,1,1,2,1,1,1,2,1,.5,1,1,1],
  [1,1,2,.5,.5,1,1,1,0,2,1,1,1,1,.5,1,1,1],
  [1,.5,2,1,.5,1,1,.5,2,.5,1,.5,2,1,.5,1,.5,1],
  [1,.5,.5,1,2,.5,1,1,2,2,1,1,1,1,2,1,.5,1],
  [2,1,1,1,1,2,1,.5,1,.5,.5,.5,2,0,1,2,2,.5],
  [1,1,1,1,2,1,1,.5,.5,1,1,1,.5,.5,1,1,0,2],
  [1,2,1,2,.5,1,1,2,1,0,1,.5,2,1,1,1,2,1],
  [1,1,1,.5,2,1,2,1,1,1,1,2,.5,1,1,1,.5,1],
  [1,1,1,1,1,1,2,2,1,1,.5,1,1,1,1,0,.5,1],
  [1,.5,1,1,2,1,.5,.5,1,.5,2,1,1,.5,1,2,.5,.5],
  [1,2,1,1,1,2,.5,1,.5,2,1,2,1,1,1,1,.5,1],
  [0,1,1,1,1,1,1,1,1,1,2,1,1,2,1,.5,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,.5,0],
  [1,1,1,1,1,1,.5,1,1,1,2,1,1,2,1,.5,.5,.5],
  [1,.5,.5,.5,1,2,1,1,1,1,1,1,2,1,1,1,.5,2],
  [1,.5,1,1,1,1,2,.5,1,1,1,1,1,1,2,2,.5,1],
] as const;

const indexOf = (type: PokemonType) => POKEMON_TYPES.indexOf(type);

export function getTypeEffectiveness(attackType:PokemonType, defenseType:PokemonType):number {
  return RAW_CHART[indexOf(attackType)][indexOf(defenseType)];
}

export function getTypeEffectivenessMulti(
  attackType:PokemonType,
  defenseTypes:PokemonType[],
):number {
  return defenseTypes.reduce(
    (multiplier, defenseType) => multiplier * getTypeEffectiveness(attackType, defenseType),
    1,
  );
}
