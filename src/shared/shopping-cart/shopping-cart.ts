import { getBucket } from '@extend-chrome/storage';
import { z } from 'zod';
import { ShoppingList, ShoppingListMeta } from './types';

export interface IStorageShoppingListsBucket {
  ShoppingListsMeta: z.TypeOf<typeof ShoppingListMeta>[];
  ShoppingLists: z.TypeOf<typeof ShoppingList>[];
}
export const shoppingListsStorageBucket = getBucket<IStorageShoppingListsBucket>('shoppingListsStorageBucket', 'local');
