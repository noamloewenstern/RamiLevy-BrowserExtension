import { onMessage } from 'webext-bridge/content-script';

interface ItemInfo {
  itemId: number;
  name: string;
  quantity: number;
  price?: number;
  totalPrice?: number;
  isAvailable?: boolean;
  isOnSale?: boolean;
}
interface ShoppingListMetaInfo {
  id: number;
  name: string;
  size: number;
  shoppingListElement: HTMLDivElement;
}
interface ShoppingListInfo extends ShoppingListMetaInfo {
  items: ItemInfo[];
}

const clickOnShoppingList = (shoppingListName: string, { stopRecursiveCheck = false } = {}) => {
  if (!isShoppingListsVisible()) {
    if (stopRecursiveCheck) {
      throw new Error('[clickOnShoppingList] ShoppingList lists are not visible');
    }
    document.querySelector<HTMLDialogElement>('#my-list')?.click();
  }

  const shoppingListsInfo = getShoppingListsMetaInfo();
  if (!shoppingListsInfo) {
    throw new Error('No shopping lists info found');
  }
  const shoppingListInfo = shoppingListsInfo.find(({ name }) => name === shoppingListName);
  if (!shoppingListInfo) {
    throw new Error(`Shopping List With Name "${shoppingListName}" not found`);
  }
  const clickableElemInsideShoppingList =
    shoppingListInfo.shoppingListElement.querySelector<HTMLDivElement>('div[role="button"]')!;
  clickableElemInsideShoppingList.click();
};
const getShoppingListsMetaInfo = () => {
  if (!isShoppingListsVisible()) {
    throw new Error('ShoppingList lists are not visible');
  }
  const listsDivs = [
    ...(document.querySelector<HTMLDivElement>('#online-cart-wrap > div > div:nth-child(2) > div > div > div')
      ?.children || []),
  ];
  if (!listsDivs.length) {
    throw new Error('No Shopping Lists found');
  }

  return (listsDivs as HTMLDivElement[]).map(getShoppingListMetaInfo);
};
const isShoppingListsVisible = () =>
  document.querySelector<HTMLDivElement>('#online-cart-wrap')?.classList.contains('is-list');

const getShoppingListIdFromElem = (shoppingListElem: HTMLDivElement) => {
  const divShoppingListIdRegexPattern = /^list-(\d+)$/;

  // Get the div element that matches the regular expression
  const divElement = shoppingListElem.querySelector<HTMLDivElement>('div[id^="list-"]:not([id=""])');
  if (!divElement) {
    throw new Error('No shoping list div found');
  }
  const match = !divShoppingListIdRegexPattern.exec(divElement.getAttribute('id') || '');

  const shoppingListId = +match[1];
  return shoppingListId;
};

const getShoppingListMetaInfo = (shoppingListDiv: HTMLDivElement): ShoppingListMetaInfo => {
  const shoppingListBtn = [...shoppingListDiv.querySelectorAll('div[role="button"]')].find(e =>
    e?.textContent?.includes('פתח חלונית רשימה'),
  );
  if (!shoppingListBtn) {
    throw new Error('No ShoppingList button found');
  }

  const shoppingListName = shoppingListBtn.childNodes[0].textContent!.trim()!;
  const shoppingListSize = +shoppingListBtn
    .nextElementSibling!.querySelector<HTMLSpanElement>('span')!
    .textContent!.trim()!;
  const shoppingListId = getShoppingListIdFromElem(shoppingListDiv);

  return {
    id: shoppingListId,
    name: shoppingListName,
    size: shoppingListSize,
    shoppingListElement: shoppingListDiv,
  };
};

/*
    Listeners
*/
onMessage('OPEN_SHOPPING_LISTS', () => {
  if (!isShoppingListsVisible()) {
    document.querySelector<HTMLDivElement>('#my-list')?.click();
  } else {
    document.querySelector<HTMLDivElement>('#my-list')?.click();
    // openning after closing
    setTimeout(() => {
      document.querySelector<HTMLDivElement>('#my-list')?.click();
    }, 200);
  }
});
onMessage('OPEN_SHOPPING_LIST_BY_NAME', ({ data: shoppingListName }) => {
  try {
    clickOnShoppingList(shoppingListName);
  } catch (e) {
    console.error(e);
  }
});
