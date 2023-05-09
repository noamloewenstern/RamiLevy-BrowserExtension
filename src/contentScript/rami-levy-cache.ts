import { RamiLevyCache } from './rami-levy-types';

export function getShoppingListsMetaInfo() {
  const ramilevyCache = localStorage.getItem('ramilevy');
  if (!ramilevyCache) {
    throw new Error('Error Cache for key "ramilevy"');
  }
  const parsed = JSON.parse(ramilevyCache) as RamiLevyCache;
  const shopLists = parsed.authuser?.shopLists;
  if (!shopLists) {
    throw new Error('Error Cache for key "ramilevy.authuser?.shopLists"');
  }
  return shopLists;
}
