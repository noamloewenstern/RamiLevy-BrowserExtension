import { sendMessage } from 'webext-bridge/popup';
import { getActiveTab } from './tabs';
import { IShoppingList, ShoppingList, ShoppingListBasicInfo } from '~/shared/shopping-cart/types';
import { z } from 'zod';

const _getCurrentActiveTab = async () => {
  const activeTab = await getActiveTab();
  if (!activeTab?.url?.toLowerCase().includes('www.rami-levy.co.il')) {
    alert('Current Windows is Not Rami-Levy website.');
    return;
  }
  return activeTab;
};

export const clickOnShoppingList = async ({ name, id }: { name: string; id: number }) => {
  const activeTab = await _getCurrentActiveTab();
  if (!activeTab) return;

  sendMessage('OPEN_SHOPPING_LIST', { name, id }, { context: 'content-script', tabId: activeTab.id! });
};
export async function openShoppingList({ forceReopen = false } = {}) {
  const activeTab = await _getCurrentActiveTab();
  if (!activeTab) return;

  await sendMessage('OPEN_SHOPPING_LISTS_MODAL', { forceReopen }, { context: 'content-script', tabId: activeTab.id! });
}
export const getShoppingListsMetaInfo = async () => {
  const activeTab = await _getCurrentActiveTab();
  if (!activeTab) return;
  const shoppingListsInfo = await sendMessage('GET_SHOPPING_LISTS_META_INFO', undefined, {
    context: 'content-script',
    tabId: activeTab.id!,
  });
  return shoppingListsInfo;
};

export const addProductsToShoppingList = async (payload: {
  id: number;
  name: string;
  items: Exclude<IShoppingList['items'], undefined>;
}) => {
  const activeTab = await _getCurrentActiveTab();
  if (!activeTab) return;

  await sendMessage('APPLY_DUPLICATES_PRODUCTS_TO_SHOPPING_LIST', payload, {
    context: 'content-script',
    tabId: activeTab.id!,
  });
};
export async function saveShoppingListsToNewList(payload: { shoppingLists: IShoppingList[]; newListName: string }) {
  const activeTab = await _getCurrentActiveTab();
  if (!activeTab) return;

  await sendMessage('ADD_SHOPPING_LISTS_TO_NEW_LIST', payload, {
    context: 'content-script',
    tabId: activeTab.id!,
  });
}
