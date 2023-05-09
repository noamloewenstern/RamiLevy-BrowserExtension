import { ProtocolWithReturn } from 'webext-bridge';
import { IShoppingList, IShoppingListMeta } from '~/shared/shopping-cart/types';
import z from 'zod';

declare module 'webext-bridge' {
  export interface ProtocolMap {
    GET_SHOPPING_LISTS_META_INFO: () => IShoppingListMeta[];
    OPEN_SHOPPING_LISTS_MODAL: { forceReopen?: boolean };
    OPEN_SHOPPING_LIST: { id: number; name: string };
    APPLY_DUPLICATES_PRODUCTS_TO_SHOPPING_LIST: {
      id: number;
      name: string;
      items: Exclude<IShoppingList['items'], undefined>;
    };
    ADD_SHOPPING_LISTS_TO_NEW_LIST: {
      shoppingLists: IShoppingList[];
      newListName: string;
    };
  }
}
