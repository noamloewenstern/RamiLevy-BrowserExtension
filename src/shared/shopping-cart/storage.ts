import { getBucket } from '@extend-chrome/storage';
import { z } from 'zod';
import { ShoppingList } from './types';

export interface IStorageShoppingListsBucket {
  ShoppingLists: z.TypeOf<typeof ShoppingList>[];
}
export const shoppingListsStorageBucket = getBucket<IStorageShoppingListsBucket>('shoppingListsStorageBucket', 'local');

export interface IStorageItemsNamesBucket {
  [key: number]: string;
}
export const ItemsMapBucket = getBucket<IStorageItemsNamesBucket>('ItemsMapBucket', 'local');
