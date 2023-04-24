import { z } from 'zod';
import { ShoppingList } from '~/shared/shopping-cart/types';
export const getShoppingListItemsMergedContentFromDuplicates = async ({
  shoppingList1,
  shoppingList2,
}: {
  shoppingList1: z.TypeOf<typeof ShoppingList>;
  shoppingList2: z.TypeOf<typeof ShoppingList>;
}) => {
  const itemsList1 = shoppingList1.items || [];
  const itemsList2 = shoppingList2.items || [];
  const duplicatedItems = itemsList1
    .filter(item1 => itemsList2.some(item2 => item1.item_id === item2.item_id))
    .concat(itemsList2.filter(item2 => itemsList1.find(item1 => item1.item_id === item2.item_id)))
    .map(item => ({ ...item })); // clone item
  const mergedItemsContentFromDuplicatedItems = duplicatedItems.reduce((acc, item) => {
    const existingItem = acc.find(accItem => accItem.item_id === item.item_id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push(item);
    }
    return acc;
  }, [] as typeof duplicatedItems);

  return mergedItemsContentFromDuplicatedItems;
};
