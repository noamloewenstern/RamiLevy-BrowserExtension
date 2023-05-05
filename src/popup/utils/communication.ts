import { sendMessage } from 'webext-bridge/popup';
import { getActiveTab } from './tabs';

const _getCurrentActiveTab = async () => {
  const activeTab = await getActiveTab();
  if (!activeTab?.url?.toLowerCase().includes('www.rami-levy.co.il')) {
    alert('Current Windows is Not Rami-Levy website.');
    return;
  }
  return activeTab;
};

export const clickOnShoppingList = async (listName: string) => {
  const activeTab = await _getCurrentActiveTab();
  if (!activeTab) return;

  sendMessage('OPEN_SHOPPING_LIST_BY_NAME', listName, { context: 'content-script', tabId: activeTab.id! });
};
export const showShoppingLists = async () => {
  const activeTab = await _getCurrentActiveTab();
  if (!activeTab) return;
  sendMessage('OPEN_SHOPPING_LISTS', undefined, { context: 'content-script', tabId: activeTab.id! });
};
