import { ShoppingListBasicInfo } from '~/shared/shopping-cart/types';
import { emulateTextInput, wait, waitForValue } from '~/utils/helpers';
import { getShoppingListsMetaInfo } from '../rami-levy-cache';
export interface ItemInfo {
  itemId: number;
  name: string;
  quantity: number;
  price?: number;
  totalPrice?: number;
  isAvailable?: boolean;
  isOnSale?: boolean;
}

export interface ShoppingListMetaInfo {
  id: number;
  name: string;
  size: number;
  shoppingListElement: HTMLDivElement;
}
export interface ShoppingListInfo extends ShoppingListMetaInfo {
  items: ItemInfo[];
}

export function getDeliveryModal() {
  return document.querySelector<HTMLDivElement>('.delivery-modal');
}
export function closeDeliveryModal() {
  const modal = getDeliveryModal();
  if (!modal) {
    return;
  }
  const closeBtn = modal.querySelector<HTMLDivElement>('div#close-popup');
  closeBtn?.click();
}
export function isDeliveryModalVisible() {
  return getDeliveryModal() !== null;
}

export async function clearCurrentCart() {
  const clearBtn = document.querySelector<HTMLDivElement>('div[role="button"]#remove-cart');
  if (!clearBtn) {
    return;
  }
  clearBtn.click();
  const confirmDeleteBtn = await waitForValue(
    () => document.querySelector<HTMLButtonElement>('#delete-cart-btn')!,
    5000,
  );
  confirmDeleteBtn?.click();

  await waitForValue(() => document.querySelector('div.empty-cart-main')!, 5000);
}

export async function addShoppingListToCart(shoppingList: ShoppingListBasicInfo, { clearCurrent = false } = {}) {
  if (clearCurrent) {
    await clearCurrentCart();
  }
  await clickOnShoppingList(shoppingList);

  const addItemsToCartBtn = await waitForValue(
    () => document.querySelector('div.modal-body div > button[aria-label="הוספת מוצרים לסל"]') as HTMLButtonElement,
    { ms: 4000, message: 'timeout waiting for "הוספת מוצרים לסל" button' },
  );
  // wait for items to load
  await waitForValue(
    () =>
      document
        .querySelector('div.modal-body div.inner-scroll.rl-scroll')
        ?.firstElementChild?.querySelector('div.plus-minus div.counter>div.number'),
    3000,
  );
  addItemsToCartBtn!.click();
  await waitForValue(
    () =>
      [...document.querySelectorAll('div.modal-dialog  div.modal-body button>span')].find(
        e => e.textContent === 'הסל נוסף בהצלחה',
      )!,
    { ms: 3000, message: 'timeout waiting for "הסל נוסף בהצלחה"' },
  );
}

const getShoppingListsMetaInfoWithElems = async () =>
  Promise.all(
    getShoppingListsMetaInfo().map(async listInfo => ({
      ...listInfo,
      listElement: await getShoppingListElemFromId(listInfo.id),
      size: listInfo.items_count,
    })),
  );
export async function clickOnShoppingList({ id: shoppingListId }: ShoppingListBasicInfo) {
  await waitTillShoppingListsVisible();

  const shoppingListsInfo = await getShoppingListsMetaInfoWithElems();
  const shoppingListInfo = shoppingListsInfo.find(({ id }) => id === shoppingListId);
  if (!shoppingListInfo) {
    throw new Error(`Shopping List With Id "${shoppingListId}" not found`);
  }
  shoppingListInfo.listElement!.click();
  return await waitForValue(() => isCurrentlyViewingAShoppingList({ includeLoadedItems: true }), {
    ms: 5000,
    message: `clickOnShoppingList ${shoppingListId} > isCurrentlyViewingAShoppingList`,
  });
}

async function getShoppingListElemFromId(id: number) {
  return waitForValue(() => document.querySelector<HTMLDivElement>(`div#list-${id}`), 2000);
}

export async function toggleShowShoppingLists() {
  if (isShoppingListsVisible()) {
    // close modal
    document.querySelector<HTMLDivElement>('div#close-modal')?.click();
    await waitForValue(() => !isShoppingListsVisible(), {
      ms: 4000,
      message: 'toggleShowShoppingLists > !isShoppingListsVisible()',
    });
    return;
  }

  const viewingShoppingList = isCurrentlyViewingAShoppingList();
  if (viewingShoppingList) {
    // close shopping list
    viewingShoppingList.closeBtn.click();
    await waitForValue(() => !isCurrentlyViewingAShoppingList(), {
      ms: 4000,
      message: 'toggleShowShoppingLists > !isCurrentlyViewingAShoppingList()',
    });
    return;
  }

  // open modal
  document.querySelector<HTMLDialogElement>('#my-list')?.click();
  await waitForValue(isShoppingListsVisible, {
    ms: 4000,
    message: 'toggleShowShoppingLists > isShoppingListsVisible',
  });
}
export function isCurrentlyViewingAShoppingList({ includeLoadedItems = false } = {}) {
  const backBtn = document.querySelector('div.modal-dialog div.modal-body h2') as HTMLElement | undefined;
  const closeBtn = document.querySelector<HTMLDivElement>('div#close-modal');
  const modalContentElem = document.querySelector<HTMLDivElement>('div.modal-dialog.modal-lg > div.modal-content');
  const respObj = backBtn?.textContent?.trim() === 'חזרה' &&
    !!closeBtn &&
    !!modalContentElem &&
    document.querySelector('div.top-modal h3#title-wrap')?.textContent?.trim() === 'שם הרשימה:' && {
      backBtn,
      closeBtn,
      modalContentElem,
    }; // return backBtn if all conditions are met
  if (
    includeLoadedItems &&
    !document
      .querySelector('div.modal-body div.inner-scroll.rl-scroll')
      ?.firstElementChild?.querySelector('div.plus-minus div.counter>div.number')
  ) {
    return;
  }
  return respObj;
}
export async function waitTillShoppingListsVisible(ms = 4000) {
  if (isShoppingListsVisible()) {
    return;
  }
  const viewingShoppingList = isCurrentlyViewingAShoppingList();
  if (viewingShoppingList) {
    viewingShoppingList.backBtn.click();
  } else {
    // nothing is open - open the modal
    await toggleShowShoppingLists();
  }
  await waitForValue(isShoppingListsVisible, ms);
}

export function isShoppingListsVisible() {
  return (
    document.querySelector('div.modal-body div#close-modal') &&
    !isCurrentlyViewingAShoppingList() &&
    document.querySelector('div.modal-body h3')?.textContent?.trim() === 'הרשימות שלי'
  );
}

export function getShoppingListIdFromElem(shoppingListElem: HTMLDivElement) {
  const divShoppingListIdRegexPattern = /^list-(\d+)$/;

  // Get the div element that matches the regular expression
  const divElement = shoppingListElem.querySelector<HTMLDivElement>('div[id^="list-"]:not([id=""])');
  if (!divElement) {
    throw new Error('No shoping list div found');
  }
  const match = divShoppingListIdRegexPattern.exec(divElement.getAttribute('id') || '')!;

  const shoppingListId = +match[1];
  return shoppingListId;
}

export async function saveCartAsShoppingList(shoppingListName: string) {
  if (isShoppingListsVisible()) {
    await toggleShowShoppingLists();
    await waitForValue(() => !isShoppingListsVisible() && !isCurrentlyViewingAShoppingList(), 4000);
  }
  const saveToListBtn = await waitForValue(() => document.querySelector<HTMLDivElement>('div#save-to-list')!, {
    ms: 4000,
    message: 'saveCartAsShoppingList > saveToListBtn',
  });
  saveToListBtn.click();
  const input = await waitForValue(() => document.querySelector('input#basket-name-new')! as HTMLInputElement, {
    ms: 4000,
    message: 'saveCartAsShoppingList > inputElem#basket-name-new',
  });
  emulateTextInput(input, shoppingListName);
  const saveBtn = input.nextElementSibling as HTMLButtonElement;
  saveBtn.click();
  await waitForValue(() => !document.querySelector<HTMLInputElement>('input#basket-name-new')!, {
    ms: 4000,
    message: 'saveCartAsShoppingList > !inputElem#basket-name-new',
  });
}
