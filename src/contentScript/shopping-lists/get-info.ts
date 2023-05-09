import { RamiLevyCache } from '../rami-levy-types';

let $cache: RamiLevyCache | null;
const loadLocalStorageCache = ({ force } = { force: false }) => {
  if (force || !$cache) {
    const cached = localStorage.getItem('ramilevy');
    if (!cached) {
      throw new Error('no cache found');
    }
    $cache = JSON.parse(cached) as RamiLevyCache;
  }
  return $cache;
};

const getShoppingList = ({ id, name } = { id: undefined, name: '' }) => {
  if (!id && !name) {
    throw new Error('id or name must be provided');
  }
  const cache = loadLocalStorageCache();
  const list = cache.authuser.shopLists.find(list => list.id === id || list.name === name);
  if (!list) {
    throw new Error(`list not found: ${id} ${name}`);
  }

  return list;
};
