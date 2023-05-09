import { z } from 'zod';
import { ItemsMapBucket } from './storage';
import { ShoppingList, IShoppingList } from './types';
type Items = Exclude<z.TypeOf<typeof ShoppingList>['items'], undefined>;

export async function mergeQuantityDuplicatedItems(...shoppingLists: IShoppingList[]): Promise<[Items, Items]> {
  const mergedItems: Items = [];
  const duplicatesIds = new Set<number>();
  for (const shoppingList of shoppingLists) {
    if (!shoppingList.items?.length) continue;
    for (const item of shoppingList.items) {
      const foundItem = mergedItems.find(item2 => item2.item_id === item.item_id);
      if (!foundItem) {
        mergedItems.push(item);
        continue;
      }
      foundItem.quantity += item.quantity;
      duplicatesIds.add(item.item_id);
    }
  }

  const duplicatesItems = mergedItems.filter(item => duplicatesIds.has(item.item_id));
  return [mergedItems, duplicatesItems];
}

export async function addNamesToItems(items: Exclude<IShoppingList['items'], undefined>) {
  const itemsNamesMap = await ItemsMapBucket.get();
  const itemsWithNames = items.map(item => {
    const name = itemsNamesMap[item.item_id] || item.item_id.toString();
    return { ...item, name };
  });
  return itemsWithNames;
}

export async function getDuplicatedItems(...shoppingLists: IShoppingList[]) {
  const [mergedItems, duplicatedItems] = await mergeQuantityDuplicatedItems(...shoppingLists);
  if (duplicatedItems.length === 0) {
    return [];
  }
  return await addNamesToItems(duplicatedItems);
}
