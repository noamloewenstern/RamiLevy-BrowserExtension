import { z } from 'zod';

/* API Types */
export const ItemInfo = z.object({
  // id: z.number(),
  shop_list_id: z.number(),
  item_id: z.number(),
  barcode: z.string(),
  quantity: z.number(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),

  name: z.string().optional(),
  quantityType: z.union([z.literal('weight'), z.literal('count')]).optional(),
  price: z.number().optional(),
  totalPrice: z.number().optional(),
  isAvailable: z.boolean().optional(),
  isOnSale: z.boolean().optional(),
});
export const ShoppingListMeta = z.object({
  id: z.number(),
  uuid: z.string(),
  name: z.string(),
  items_count: z.number(),
  customer_id: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export const ShoppingList = ShoppingListMeta.extend({
  items: z.array(ItemInfo).default([]).optional(),
});
export const ResponseShoppingLists = z.object({
  success: z.boolean(),
  data: z.array(ShoppingListMeta),
  message: z.string(),
});
export const ResponseSingleShoppingList = z.object({
  success: z.boolean(),
  data: ShoppingList.omit({ items_count: true }).extend({ items: z.array(ItemInfo) }),
  message: z.string(),
});
export interface ShoppingListBasicInfo {
  id: z.TypeOf<typeof ShoppingListMeta>['id'];
  name: z.TypeOf<typeof ShoppingListMeta>['name'];
}

export type IShoppingList = Exclude<z.TypeOf<typeof ShoppingList>, undefined>;
export type IShoppingListMeta = Exclude<z.TypeOf<typeof ShoppingListMeta>, undefined>;
export type IShoppingListItem = Exclude<z.TypeOf<typeof ItemInfo>, undefined>;
