import { ProtocolWithReturn } from 'webext-bridge';
import { ShoppingList } from '~/shared/shopping-cart/types';

declare module 'webext-bridge' {
  export interface ProtocolMap {
    OPEN_SHOPPING_LISTS: undefined;
    OPEN_SHOPPING_LIST_BY_NAME: ProtocolWithReturn<string, void>;
    APPLY_DUPLICATES_PRODUCTS_TO_SHOPPING_LIST: ProtocolWithReturn<
      { shoppingListName: string; shoppingListId: number; products: z.TypeOf<typeof ShoppingList>['items'] },
      { success: boolean; error?: string }
    >;
  }
}
